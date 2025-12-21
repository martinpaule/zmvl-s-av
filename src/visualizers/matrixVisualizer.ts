import { VisualizerFunction } from "./types";

/**
 * MATRIX RAIN VISUALIZER
 * 
 * Digital rain effect inspired by The Matrix, reactive to audio
 */

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
}

const columns: MatrixColumn[] = [];
const chars = "ZMVL01アイウエオカキクケコサシスセソタチツテトナニヌネノ".split("");

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
  // Semi-transparent background for trail effect
  ctx.fillStyle = "rgba(10, 10, 10, 0.1)";
  ctx.fillRect(0, 0, width, height);

  const fontSize = 14;
  const columnCount = Math.floor(width / fontSize);
  
  // Initialize columns if needed
  while (columns.length < columnCount) {
    columns.push({
      x: columns.length * fontSize,
      y: Math.random() * height,
      speed: 2 + Math.random() * 3,
      chars: Array(20).fill(0).map(() => getRandomChar()),
    });
  }

  // Update and draw columns
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const frequencyIndex = Math.floor((i / columns.length) * frequencyData.length);
    const intensity = frequencyData[frequencyIndex] / 255;
    
    // Speed based on audio intensity
    col.y += col.speed * (1 + intensity * 2 + metrics.bass);
    
    if (col.y > height + 200) {
      col.y = -200;
      col.chars = Array(20).fill(0).map(() => getRandomChar());
    }

    // Draw characters
    for (let j = 0; j < col.chars.length; j++) {
      const charY = col.y - j * fontSize;
      if (charY < 0 || charY > height) continue;
      
      // First char is brightest
      if (j === 0) {
        ctx.fillStyle = `hsla(120, 100%, ${70 + intensity * 30}%, 1)`;
      } else {
        const fade = 1 - j / col.chars.length;
        ctx.fillStyle = `hsla(120, 100%, 50%, ${fade * (0.3 + intensity * 0.7)})`;
      }
      
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText(col.chars[j], col.x, charY);
      
      // Randomly change characters
      if (Math.random() < 0.02 + intensity * 0.05) {
        col.chars[j] = getRandomChar();
      }
    }
  }
  
  // Add glow overlay based on volume
  if (metrics.volume > 0.5) {
    ctx.fillStyle = `hsla(120, 100%, 50%, ${(metrics.volume - 0.5) * 0.1})`;
    ctx.fillRect(0, 0, width, height);
  }
};
