import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useMusic } from "./MusicContext";

/**
 * VISUALIZER SYSTEM
 * 
 * This context provides procedural/simulated frequency data for visualizations.
 * Since Spotify embeds don't expose audio data to the Web Audio API,
 * we generate simulated frequency data based on the "playing" state.
 * 
 * TO INTEGRATE REAL AUDIO ANALYSIS:
 * 1. Replace the simulated data generation in useEffect with actual Web Audio API analysis
 * 2. Create an AudioContext and AnalyserNode
 * 3. Connect your audio source to the analyser
 * 4. Call analyser.getByteFrequencyData(frequencyData) each frame
 */

interface AudioMetrics {
  volume: number;      // 0-1, overall volume
  bass: number;        // 0-1, low frequency energy
  mid: number;         // 0-1, mid frequency energy
  treble: number;      // 0-1, high frequency energy
}

interface VisualizerContextType {
  frequencyData: Uint8Array;
  metrics: AudioMetrics;
  isActive: boolean;
  time: number;
}

const FREQUENCY_BINS = 64;

const VisualizerContext = createContext<VisualizerContextType | undefined>(undefined);

export function VisualizerProvider({ children }: { children: React.ReactNode }) {
  const { isPlaying } = useMusic();
  const [frequencyData] = useState(() => new Uint8Array(FREQUENCY_BINS));
  const [metrics, setMetrics] = useState<AudioMetrics>({ volume: 0, bass: 0, mid: 0, treble: 0 });
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  const generateSimulatedData = useCallback((t: number) => {
    /**
     * SIMULATED FREQUENCY DATA
     * 
     * This generates procedural frequency data that mimics audio response.
     * Replace this with real audio analysis when possible.
     */
    for (let i = 0; i < FREQUENCY_BINS; i++) {
      const normalizedBin = i / FREQUENCY_BINS;
      
      // Bass frequencies (first third) - stronger, slower movement
      // Mid frequencies (middle third) - medium intensity
      // Treble frequencies (last third) - faster, lower intensity
      
      let intensity: number;
      
      if (normalizedBin < 0.33) {
        // Bass - slow, powerful pulses
        intensity = 150 + Math.sin(t * 2 + i * 0.5) * 80 + Math.random() * 30;
      } else if (normalizedBin < 0.66) {
        // Mid - medium speed variation
        intensity = 100 + Math.sin(t * 4 + i * 0.3) * 60 + Math.random() * 40;
      } else {
        // Treble - fast, spiky
        intensity = 60 + Math.sin(t * 8 + i * 0.2) * 40 + Math.random() * 50;
      }
      
      // Add some randomness for organic feel
      intensity += Math.sin(t * 3 + i) * 20;
      
      frequencyData[i] = Math.max(0, Math.min(255, intensity));
    }

    // Calculate metrics
    const bassSum = Array.from(frequencyData.slice(0, Math.floor(FREQUENCY_BINS / 3)))
      .reduce((a, b) => a + b, 0);
    const midSum = Array.from(frequencyData.slice(Math.floor(FREQUENCY_BINS / 3), Math.floor(2 * FREQUENCY_BINS / 3)))
      .reduce((a, b) => a + b, 0);
    const trebleSum = Array.from(frequencyData.slice(Math.floor(2 * FREQUENCY_BINS / 3)))
      .reduce((a, b) => a + b, 0);
    const totalSum = bassSum + midSum + trebleSum;

    const binsPerSection = FREQUENCY_BINS / 3;
    
    setMetrics({
      volume: totalSum / (FREQUENCY_BINS * 255),
      bass: bassSum / (binsPerSection * 255),
      mid: midSum / (binsPerSection * 255),
      treble: trebleSum / (binsPerSection * 255),
    });
  }, [frequencyData]);

  useEffect(() => {
    if (!isPlaying) {
      // Fade out when not playing
      for (let i = 0; i < FREQUENCY_BINS; i++) {
        frequencyData[i] = Math.max(0, frequencyData[i] - 5);
      }
      setMetrics({ volume: 0, bass: 0, mid: 0, treble: 0 });
      return;
    }

    startTimeRef.current = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      setTime(elapsed);
      generateSimulatedData(elapsed);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, generateSimulatedData, frequencyData]);

  return (
    <VisualizerContext.Provider
      value={{
        frequencyData,
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
