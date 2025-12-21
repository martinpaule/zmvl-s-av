import { VisualizerFunction } from "./types";

/**
 * MATRIX RAIN VISUALIZER
 * 
 * Digital rain effect inspired by The Matrix, reactive to relative audio changes
 */

interface MatrixColumn {
  x: number;
  y: number;
  baseSpeed: number;
  chars: string[];
}

const columns: MatrixColumn[] = [];
const chars = "ZMVL01アイウエオカキクケコサシスセソタチツテトナニヌネノ".split("");

// Running averages for normalization
let avgBass = 0.3;
let avgVolume = 0.3;
let peakBass = 0.5;

function getRandomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

export const matrixVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics
) => {
  // Update running averages
  const smoothing = 0.93;
  avgBass = avgBass * smoothing + metrics.bass * (1 - smoothing);
  avgVolume = avgVolume * smoothing + metrics.volume * (1 - smoothing);
  
  if (metrics.bass > peakBass) peakBass = metrics.bass;
  peakBass = Math.max(0.25, peakBass * 0.998);
  
  // Calculate relative values
  const relBass = Math.min(2, (metrics.bass - avgBass * 0.6) / Math.max(0.1, avgBass));
  const normalizedBass = metrics.bass / Math.max(0.2, peakBass);
  
  // Semi-transparent background for trail effect
  const fadeAmount = 0.08 + normalizedBass * 0.04;
  ctx.fillStyle = `rgba(10, 10, 10, ${fadeAmount})`;
  ctx.fillRect(0, 0, width, height);

  const fontSize = 14;
  const columnCount = Math.floor(width / fontSize);
  
  // Initialize columns if needed
  while (columns.length < columnCount) {
    columns.push({
      x: columns.length * fontSize,
      y: Math.random() * height,
      baseSpeed: 2 + Math.random() * 2,
      chars: Array(20).fill(0).map(() => getRandomChar()),
    });
  }

  // Update and draw columns
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const frequencyIndex = Math.floor((i / columns.length) * frequencyData.length);
    const rawIntensity = frequencyData[frequencyIndex] / 255;
    
    // Normalize to relative intensity
    const avgIntensity = 0.3;
    const relIntensity = Math.min(2, (rawIntensity - avgIntensity * 0.4) / Math.max(0.15, avgIntensity));
    
    // Speed based on relative audio intensity
    const speedMult = 1 + Math.max(0, relBass) * 1.2 + Math.max(0, relIntensity) * 0.8;
    col.y += col.baseSpeed * speedMult;
    
    if (col.y > height + 200) {
      col.y = -200;
      col.chars = Array(20).fill(0).map(() => getRandomChar());
    }

    // Draw characters
    for (let j = 0; j < col.chars.length; j++) {
      const charY = col.y - j * fontSize;
      if (charY < 0 || charY > height) continue;
      
      // First char is brightest, brightness responds to relative intensity
      if (j === 0) {
        const brightness = 65 + Math.max(0, relIntensity) * 30;
        ctx.fillStyle = `hsla(120, 100%, ${brightness}%, 1)`;
      } else {
        const fade = 1 - j / col.chars.length;
        const alpha = fade * (0.4 + Math.max(0, relIntensity) * 0.5 + normalizedBass * 0.1);
        ctx.fillStyle = `hsla(120, 100%, 50%, ${alpha})`;
      }
      
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText(col.chars[j], col.x, charY);
      
      // Character change rate responds to relative intensity
      const changeRate = 0.015 + Math.max(0, relIntensity) * 0.04;
      if (Math.random() < changeRate) {
        col.chars[j] = getRandomChar();
      }
    }
  }
  
  // Add glow overlay based on relative bass peaks
  if (relBass > 0.3) {
    ctx.fillStyle = `hsla(120, 100%, 50%, ${(relBass - 0.3) * 0.08})`;
    ctx.fillRect(0, 0, width, height);
  }
};
