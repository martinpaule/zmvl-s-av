import { useRef, useEffect } from "react";
import { useVisualizer } from "@/contexts/VisualizerContext";
import { barsVisualizer } from "@/visualizers/barsVisualizer";
import { VisualizerFunction } from "@/visualizers/types";

interface VisualizerCanvasProps {
  visualizer?: VisualizerFunction;
  className?: string;
}

export function VisualizerCanvas({ 
  visualizer = barsVisualizer,
  className = "" 
}: VisualizerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frequencyData, waveformData, metrics, time, isActive } = useVisualizer();
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      
      // Clear and render
      ctx.clearRect(0, 0, rect.width, rect.height);
      visualizer(ctx, rect.width, rect.height, time, frequencyData, metrics, waveformData);
      
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visualizer, frequencyData, waveformData, metrics, time, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      aria-label="Audio visualizer"
      role="img"
    />
  );
}
