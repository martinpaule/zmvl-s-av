import { VisualizerFunction } from "./types";

/**
 * SPECTRUM VISUALIZER
 * 
 * Horizontal mirrored spectrum display with smooth gradients
 */
export const spectrumVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics
) => {
  // Clear with dark background
  ctx.fillStyle = "hsl(0, 0%, 4%)";
  ctx.fillRect(0, 0, width, height);

  const centerY = height / 2;
  const numBars = frequencyData.length;
  const barWidth = width / numBars;

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "hsla(180, 100%, 50%, 0.8)");
  gradient.addColorStop(0.5, "hsla(127, 100%, 50%, 0.8)");
  gradient.addColorStop(1, "hsla(75, 100%, 50%, 0.8)");

  // Draw mirrored bars
  for (let i = 0; i < numBars; i++) {
    const value = frequencyData[i] / 255;
    const barHeight = value * height * 0.45;
    const x = i * barWidth;

    // Top bars (going up from center)
    ctx.fillStyle = gradient;
    ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight);
    
    // Bottom bars (going down from center, mirrored)
    ctx.fillRect(x, centerY, barWidth - 1, barHeight);
    
    // Glow effect for peaks
    if (value > 0.7) {
      const glowIntensity = (value - 0.7) / 0.3;
      ctx.shadowColor = `hsla(180, 100%, 50%, ${glowIntensity})`;
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight);
      ctx.fillRect(x, centerY, barWidth - 1, barHeight);
      ctx.shadowBlur = 0;
    }
  }

  // Center line
  ctx.strokeStyle = `hsla(0, 0%, 95%, ${0.5 + metrics.volume * 0.3})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  // Reactive corner elements
  const cornerSize = 20 + metrics.bass * 30;
  ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.3 + metrics.bass * 0.4})`;
  ctx.lineWidth = 2;
  
  // Top left
  ctx.beginPath();
  ctx.moveTo(10, 10 + cornerSize);
  ctx.lineTo(10, 10);
  ctx.lineTo(10 + cornerSize, 10);
  ctx.stroke();
  
  // Top right
  ctx.beginPath();
  ctx.moveTo(width - 10 - cornerSize, 10);
  ctx.lineTo(width - 10, 10);
  ctx.lineTo(width - 10, 10 + cornerSize);
  ctx.stroke();
  
  // Bottom left
  ctx.beginPath();
  ctx.moveTo(10, height - 10 - cornerSize);
  ctx.lineTo(10, height - 10);
  ctx.lineTo(10 + cornerSize, height - 10);
  ctx.stroke();
  
  // Bottom right
  ctx.beginPath();
  ctx.moveTo(width - 10 - cornerSize, height - 10);
  ctx.lineTo(width - 10, height - 10);
  ctx.lineTo(width - 10, height - 10 - cornerSize);
  ctx.stroke();
};
