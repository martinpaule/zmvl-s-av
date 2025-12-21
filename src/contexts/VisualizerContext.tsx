import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";

/**
 * REAL AUDIO VISUALIZER CONTEXT
 * 
 * This context provides actual frequency data from Web Audio API analyser.
 * It connects to the AudioPlayerContext's analyser node.
 */

export interface AudioMetrics {
  volume: number;      // 0-1, overall volume
  bass: number;        // 0-1, low frequency energy
  mid: number;         // 0-1, mid frequency energy
  treble: number;      // 0-1, high frequency energy
}

interface VisualizerContextType {
  frequencyData: Uint8Array;
  waveformData: Uint8Array;
  metrics: AudioMetrics;
  isActive: boolean;
  time: number;
}

const FREQUENCY_BINS = 128;

const VisualizerContext = createContext<VisualizerContextType | undefined>(undefined);

export function VisualizerProvider({ children }: { children: React.ReactNode }) {
  const { analyserNode, isPlaying } = useAudioPlayer();
  const [frequencyData] = useState(() => new Uint8Array(FREQUENCY_BINS));
  const [waveformData] = useState(() => new Uint8Array(FREQUENCY_BINS));
  const [metrics, setMetrics] = useState<AudioMetrics>({ volume: 0, bass: 0, mid: 0, treble: 0 });
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  const calculateMetrics = useCallback((data: Uint8Array) => {
    const binsPerSection = Math.floor(data.length / 3);
    
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;
    
    for (let i = 0; i < binsPerSection; i++) {
      bassSum += data[i];
    }
    for (let i = binsPerSection; i < binsPerSection * 2; i++) {
      midSum += data[i];
    }
    for (let i = binsPerSection * 2; i < data.length; i++) {
      trebleSum += data[i];
    }
    
    const totalSum = bassSum + midSum + trebleSum;
    
    return {
      volume: totalSum / (data.length * 255),
      bass: bassSum / (binsPerSection * 255),
      mid: midSum / (binsPerSection * 255),
      treble: trebleSum / (binsPerSection * 255),
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      // Fade out when not playing
      for (let i = 0; i < FREQUENCY_BINS; i++) {
        frequencyData[i] = Math.max(0, frequencyData[i] * 0.9);
        waveformData[i] = 128; // Center line
      }
      setMetrics({ volume: 0, bass: 0, mid: 0, treble: 0 });
      return;
    }

    startTimeRef.current = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      setTime(elapsed);
      
      if (analyserNode) {
        // Get real frequency data
        analyserNode.getByteFrequencyData(frequencyData);
        analyserNode.getByteTimeDomainData(waveformData);
        
        // Calculate metrics
        const newMetrics = calculateMetrics(frequencyData);
        setMetrics(newMetrics);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, analyserNode, frequencyData, waveformData, calculateMetrics]);

  return (
    <VisualizerContext.Provider
      value={{
        frequencyData,
        waveformData,
        metrics,
        isActive: isPlaying,
        time,
      }}
    >
      {children}
    </VisualizerContext.Provider>
  );
}

export function useVisualizer() {
  const context = useContext(VisualizerContext);
  if (context === undefined) {
    throw new Error("useVisualizer must be used within a VisualizerProvider");
  }
  return context;
}
