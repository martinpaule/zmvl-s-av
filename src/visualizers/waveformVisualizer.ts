import { VisualizerFunction } from "./types";

/**
 * WAVEFORM VISUALIZER
 * 
 * Displays the audio waveform with relative amplitude scaling
 */

// Running averages for normalization
let avgVolume = 0.3;
let avgBass = 0.3;
let avgTreble = 0.3;
let peakAmplitude = 0.5;

export const waveformVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics,
  waveformData
) => {
  // Update running averages
  const smoothing = 0.93;
  avgVolume = avgVolume * smoothing + metrics.volume * (1 - smoothing);
  avgBass = avgBass * smoothing + metrics.bass * (1 - smoothing);
  avgTreble = avgTreble * smoothing + metrics.treble * (1 - smoothing);
  
  // Track peak amplitude from waveform
  if (waveformData && waveformData.length > 0) {
    let maxAmp = 0;
    for (let i = 0; i < waveformData.length; i++) {
      const amp = Math.abs(waveformData[i] - 128) / 128;
      if (amp > maxAmp) maxAmp = amp;
    }
    if (maxAmp > peakAmplitude) peakAmplitude = maxAmp;
  }
  peakAmplitude = Math.max(0.2, peakAmplitude * 0.997);
  
  // Calculate relative values
  const relBass = Math.min(2, (metrics.bass - avgBass * 0.5) / Math.max(0.1, avgBass));
  const relTreble = Math.min(2, (metrics.treble - avgTreble * 0.5) / Math.max(0.1, avgTreble));
  const normalizedVolume = metrics.volume / Math.max(0.15, avgVolume * 1.5);
  
  // Clear with dark background
  ctx.fillStyle = "hsl(0, 0%, 4%)";
  ctx.fillRect(0, 0, width, height);

  // Draw center line
  ctx.strokeStyle = "hsl(0, 0%, 15%)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  if (!waveformData || waveformData.length === 0) return;

  const sliceWidth = width / waveformData.length;
  
  // Calculate waveform amplitude for auto-scaling
  let currentPeak = 0;
  for (let i = 0; i < waveformData.length; i++) {
    const amp = Math.abs(waveformData[i] - 128) / 128;
    if (amp > currentPeak) currentPeak = amp;
  }
  
  // Auto-scale factor
  const scaleFactor = 1 / Math.max(0.3, peakAmplitude * 1.2);
  
  // Glow effect - responds to relative changes
  const glowIntensity = 0.4 + Math.max(0, relBass) * 0.4 + normalizedVolume * 0.2;
  ctx.shadowColor = `hsla(180, 100%, 50%, ${glowIntensity})`;
  ctx.shadowBlur = 10 + Math.max(0, relBass) * 15;
  
  // Main waveform line - thickness responds to relative bass
  const lineWidth = 1.5 + Math.max(0, relBass) * 1.5 + normalizedVolume * 0.5;
  ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.6 + normalizedVolume * 0.3})`;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  
  let x = 0;
  for (let i = 0; i < waveformData.length; i++) {
    // Normalize and scale waveform
    const rawV = (waveformData[i] - 128) / 128;
    const scaledV = rawV * scaleFactor;
    const v = 1 + scaledV;
    const y = (v * height) / 2;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    x += sliceWidth;
  }
  
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Second line with offset for depth - responds to relative treble
  ctx.strokeStyle = `hsla(75, 100%, 50%, ${0.2 + Math.max(0, relTreble) * 0.3})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  
  x = 0;
  for (let i = 0; i < waveformData.length; i++) {
    const rawV = (waveformData[i] - 128) / 128;
    const scaledV = rawV * scaleFactor * 0.8;
    const v = 1 + scaledV;
    const y = (v * height) / 2 + 4;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    x += sliceWidth;
  }
  
  ctx.stroke();
};
