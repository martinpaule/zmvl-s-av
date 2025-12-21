import { VisualizerFunction } from "./types";

/**
 * SPECTRUM VISUALIZER
 * 
 * Horizontal mirrored spectrum display with relative normalization
 */

// Running averages for normalization
let avgVolume = 0.3;
let avgBass = 0.3;
let peakVolume = 0.5;

export const spectrumVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics
) => {
  // Update running averages
  const smoothing = 0.93;
  avgVolume = avgVolume * smoothing + metrics.volume * (1 - smoothing);
  avgBass = avgBass * smoothing + metrics.bass * (1 - smoothing);
  
  if (metrics.volume > peakVolume) peakVolume = metrics.volume;
  peakVolume = Math.max(0.2, peakVolume * 0.998);
  
  // Calculate relative values
  const relBass = Math.min(2, (metrics.bass - avgBass * 0.5) / Math.max(0.1, avgBass));
  const normalizedVolume = metrics.volume / Math.max(0.15, peakVolume);
  
  // Clear with dark background
  ctx.fillStyle = "hsl(0, 0%, 4%)";
  ctx.fillRect(0, 0, width, height);

  const centerY = height / 2;
  const numBars = frequencyData.length;
  const barWidth = width / numBars;

  // Calculate average for per-bar normalization
  let freqSum = 0;
  for (let i = 0; i < numBars; i++) {
    freqSum += frequencyData[i];
  }
  const avgFreq = freqSum / numBars / 255;
  const normalizer = Math.max(0.3, avgFreq * 2.2);

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, `hsla(180, 100%, ${50 + normalizedVolume * 15}%, 0.8)`);
  gradient.addColorStop(0.5, `hsla(127, 100%, ${50 + normalizedVolume * 15}%, 0.8)`);
  gradient.addColorStop(1, `hsla(75, 100%, ${50 + normalizedVolume * 15}%, 0.8)`);

  // Draw mirrored bars with normalization
  for (let i = 0; i < numBars; i++) {
    const rawValue = frequencyData[i] / 255;
    const value = Math.min(1, rawValue / normalizer);
    const barHeight = value * height * 0.42;
    const x = i * barWidth;

    // Top bars (going up from center)
    ctx.fillStyle = gradient;
    ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight);
    
    // Bottom bars (going down from center, mirrored)
    ctx.fillRect(x, centerY, barWidth - 1, barHeight);
    
    // Glow effect for peaks (normalized)
    if (value > 0.6) {
      const glowIntensity = (value - 0.6) / 0.4;
      ctx.shadowColor = `hsla(180, 100%, 50%, ${glowIntensity * 0.6})`;
      ctx.shadowBlur = 15 * glowIntensity;
      ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight);
      ctx.fillRect(x, centerY, barWidth - 1, barHeight);
      ctx.shadowBlur = 0;
    }
  }

  // Center line - brightness responds to relative bass
  const lineAlpha = 0.4 + normalizedVolume * 0.3 + Math.max(0, relBass) * 0.2;
  ctx.strokeStyle = `hsla(0, 0%, 95%, ${lineAlpha})`;
  ctx.lineWidth = 1.5 + Math.max(0, relBass) * 0.5;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  // Reactive corner elements - respond to relative bass
  const cornerSize = 15 + normalizedVolume * 20 + Math.max(0, relBass) * 15;
  ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.3 + Math.max(0, relBass) * 0.4})`;
  ctx.lineWidth = 1.5 + Math.max(0, relBass) * 0.5;
  
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
