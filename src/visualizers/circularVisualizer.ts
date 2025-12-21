import { VisualizerFunction } from "./types";

/**
 * CIRCULAR VISUALIZER
 * 
 * Displays frequency data in a circular/radial pattern with relative normalization
 */

// Running averages for normalization
let avgVolume = 0.3;
let avgBass = 0.3;
let avgTreble = 0.3;
let peakVolume = 0.5;

export const circularVisualizer: VisualizerFunction = (
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
  const normalizedVolume = metrics.volume / Math.max(0.15, peakVolume);
  
  // Clear with dark background
  ctx.fillStyle = "hsl(0, 0%, 4%)";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.2;
  
  // Draw outer rings - pulse with relative bass
  for (let ring = 3; ring >= 1; ring--) {
    const ringPulse = 1 + Math.max(0, relBass) * 0.1 * ring;
    ctx.strokeStyle = `hsla(0, 0%, ${10 + ring * 3 + Math.max(0, relBass) * 5}%, 0.3)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, (baseRadius + ring * 30) * ringPulse, 0, Math.PI * 2);
    ctx.stroke();
  }

  const numBars = frequencyData.length;
  const angleStep = (Math.PI * 2) / numBars;

  // Calculate average for normalization
  let freqSum = 0;
  for (let i = 0; i < numBars; i++) {
    freqSum += frequencyData[i];
  }
  const avgFreq = freqSum / numBars / 255;
  const normalizer = Math.max(0.3, avgFreq * 2.2);

  // Draw frequency bars radiating outward
  for (let i = 0; i < numBars; i++) {
    const rawValue = frequencyData[i] / 255;
    const value = Math.min(1, rawValue / normalizer);
    const angle = i * angleStep - Math.PI / 2;
    
    const innerRadius = baseRadius;
    const outerRadius = baseRadius + value * Math.min(width, height) * 0.28;
    
    const x1 = centerX + Math.cos(angle) * innerRadius;
    const y1 = centerY + Math.sin(angle) * innerRadius;
    const x2 = centerX + Math.cos(angle) * outerRadius;
    const y2 = centerY + Math.sin(angle) * outerRadius;
    
    // Color based on frequency range
    const normalizedBin = i / numBars;
    let hue: number;
    if (normalizedBin < 0.33) {
      hue = 180;
    } else if (normalizedBin < 0.66) {
      hue = 180 - (normalizedBin - 0.33) / 0.33 * 105;
    } else {
      hue = 75;
    }
    
    const brightness = 45 + value * 30;
    ctx.strokeStyle = `hsla(${hue}, 100%, ${brightness}%, ${0.4 + value * 0.5})`;
    ctx.lineWidth = 1.5 + value * 2;
    
    if (value > 0.5) {
      ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.6)`;
      ctx.shadowBlur = 8 * value;
    }
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Draw reactive center circle - responds to relative bass
  const pulseRadius = baseRadius * (0.7 + normalizedBass * 0.3 + Math.max(0, relBass) * 0.2);
  
  ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.4 + normalizedVolume * 0.4})`;
  ctx.lineWidth = 1.5 + Math.max(0, relBass);
  ctx.beginPath();
  ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Inner circle - responds to relative treble
  const innerPulse = pulseRadius * (0.5 + Math.max(0, relTreble) * 0.15);
  ctx.strokeStyle = `hsla(75, 100%, 50%, ${0.3 + Math.max(0, relTreble) * 0.4})`;
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerPulse, 0, Math.PI * 2);
  ctx.stroke();
};
