import { VisualizerFunction } from "./types";

/**
 * DEFAULT BARS VISUALIZER
 * 
 * A brutalist bar visualization with relative normalization
 */

// Running averages for normalization
let avgVolume = 0.3;
let peakVolume = 0.5;
let avgBass = 0.3;
let avgTreble = 0.3;

export const barsVisualizer: VisualizerFunction = (
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
  avgTreble = avgTreble * smoothing + metrics.treble * (1 - smoothing);
  
  if (metrics.volume > peakVolume) peakVolume = metrics.volume;
  peakVolume = Math.max(0.2, peakVolume * 0.998);
  
  // Calculate relative values
  const relBass = Math.min(2, (metrics.bass - avgBass * 0.5) / Math.max(0.1, avgBass));
  const relTreble = Math.min(2, (metrics.treble - avgTreble * 0.5) / Math.max(0.1, avgTreble));
  const normalizedBass = metrics.bass / Math.max(0.2, peakVolume);
  
  // Clear with dark background
  ctx.fillStyle = "hsl(0, 0%, 4%)";
  ctx.fillRect(0, 0, width, height);

  // Draw grid lines for brutalist effect
  ctx.strokeStyle = "hsl(0, 0%, 10%)";
  ctx.lineWidth = 1;
  
  const gridSpacing = 40;
  for (let x = 0; x < width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const numBars = frequencyData.length;
  const barWidth = (width / numBars) * 0.8;
  const gap = (width / numBars) * 0.2;

  // Calculate average frequency value for normalization
  let freqSum = 0;
  for (let i = 0; i < numBars; i++) {
    freqSum += frequencyData[i];
  }
  const avgFreq = freqSum / numBars / 255;
  const normalizer = Math.max(0.3, avgFreq * 2);

  // Color based on frequency range
  const getCyanColor = (intensity: number) => 
    `hsla(180, 100%, ${45 + intensity * 25}%, ${0.6 + intensity * 0.4})`;
  const getLimeColor = (intensity: number) => 
    `hsla(75, 100%, ${45 + intensity * 25}%, ${0.6 + intensity * 0.4})`;

  for (let i = 0; i < numBars; i++) {
    const rawValue = frequencyData[i] / 255;
    // Normalize each bar relative to average
    const value = Math.min(1, rawValue / normalizer);
    const barHeight = value * height * 0.75;
    const x = i * (barWidth + gap) + gap / 2;
    const y = height - barHeight;

    // Determine color based on frequency range
    const normalizedBin = i / numBars;
    let color: string;
    
    if (normalizedBin < 0.33) {
      color = getCyanColor(value);
    } else if (normalizedBin < 0.66) {
      const blend = (normalizedBin - 0.33) / 0.33;
      color = `hsla(${180 - blend * 105}, 100%, ${45 + value * 25}%, ${0.6 + value * 0.4})`;
    } else {
      color = getLimeColor(value);
    }

    // Main bar
    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Glow effect for high normalized values
    if (value > 0.5) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 15 * value;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.shadowBlur = 0;
    }

    // Top cap for brutalist effect
    ctx.fillStyle = `hsla(0, 0%, 95%, ${0.6 + value * 0.4})`;
    ctx.fillRect(x, y - 2, barWidth, 2);
  }

  // Add reactive center element based on relative bass
  const centerX = width / 2;
  const centerY = height / 2;
  const pulseSize = 40 + normalizedBass * 60 + Math.max(0, relBass) * 40;
  
  ctx.strokeStyle = getCyanColor(normalizedBass);
  ctx.lineWidth = 2 + Math.max(0, relBass);
  ctx.beginPath();
  ctx.rect(centerX - pulseSize / 2, centerY - pulseSize / 2, pulseSize, pulseSize);
  ctx.stroke();

  // Inner square
  const innerSize = pulseSize * 0.6;
  ctx.strokeStyle = getLimeColor(Math.max(0, relTreble) * 0.5 + 0.3);
  ctx.beginPath();
  ctx.rect(centerX - innerSize / 2, centerY - innerSize / 2, innerSize, innerSize);
  ctx.stroke();

  // Scanline effect
  const scanlineY = (time * 80) % height;
  ctx.fillStyle = `hsla(180, 100%, 50%, ${0.05 + normalizedBass * 0.05})`;
  ctx.fillRect(0, scanlineY, width, 2);
};
