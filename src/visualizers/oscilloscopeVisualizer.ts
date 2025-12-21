import { VisualizerFunction } from "./types";

/**
 * OSCILLOSCOPE VISUALIZER
 * 
 * Classic oscilloscope display with auto-scaling waveform
 */

// Running averages for normalization
let avgVolume = 0.3;
let peakAmplitude = 0.5;

export const oscilloscopeVisualizer: VisualizerFunction = (
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
  
  // Track peak amplitude from waveform for auto-scaling
  if (waveformData && waveformData.length > 0) {
    let maxAmp = 0;
    for (let i = 0; i < waveformData.length; i++) {
      const amp = Math.abs(waveformData[i] - 128) / 128;
      if (amp > maxAmp) maxAmp = amp;
    }
    if (maxAmp > peakAmplitude) peakAmplitude = maxAmp;
  }
  peakAmplitude = Math.max(0.15, peakAmplitude * 0.996);
  
  // Calculate relative values
  const relVolume = Math.min(2, (metrics.volume - avgVolume * 0.5) / Math.max(0.1, avgVolume));
  const normalizedVolume = metrics.volume / Math.max(0.1, avgVolume * 1.3);
  
  // Dark background
  ctx.fillStyle = "hsl(0, 0%, 4%)";
  ctx.fillRect(0, 0, width, height);

  // Draw grid
  ctx.strokeStyle = "hsl(0, 0%, 12%)";
  ctx.lineWidth = 1;
  
  // Vertical grid lines
  const gridSpacingX = width / 10;
  for (let x = 0; x <= width; x += gridSpacingX) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Horizontal grid lines
  const gridSpacingY = height / 8;
  for (let y = 0; y <= height; y += gridSpacingY) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw center line
  ctx.strokeStyle = "hsl(0, 0%, 20%)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  // Draw waveform with auto-scaling
  if (waveformData && waveformData.length > 0) {
    // Auto-scale factor based on peak amplitude
    const scaleFactor = 0.8 / Math.max(0.2, peakAmplitude);
    
    // Glow responds to relative volume
    const glowIntensity = Math.max(0, relVolume) * 0.4 + normalizedVolume * 0.3;
    ctx.shadowColor = `hsla(120, 100%, 50%, ${0.3 + glowIntensity})`;
    ctx.shadowBlur = 8 + glowIntensity * 12;
    
    // Line thickness responds to relative volume
    ctx.strokeStyle = `hsla(120, 100%, 50%, ${0.6 + normalizedVolume * 0.3})`;
    ctx.lineWidth = 1.5 + Math.max(0, relVolume) * 1;
    ctx.beginPath();
    
    const sliceWidth = width / waveformData.length;
    let x = 0;
    
    for (let i = 0; i < waveformData.length; i++) {
      // Normalize and auto-scale
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
  }

  // Draw measurement info - show normalized values
  const textAlpha = 0.6 + normalizedVolume * 0.3;
  ctx.fillStyle = `hsla(120, 100%, 50%, ${textAlpha})`;
  ctx.font = "12px monospace";
  ctx.fillText(`VOL: ${(normalizedVolume * 100).toFixed(0)}%`, 10, 20);
  ctx.fillText(`BASS: ${(metrics.bass / Math.max(0.2, avgVolume) * 100).toFixed(0)}%`, 10, 35);
  ctx.fillText(`MID: ${(metrics.mid / Math.max(0.2, avgVolume) * 100).toFixed(0)}%`, 10, 50);
  ctx.fillText(`TREBLE: ${(metrics.treble / Math.max(0.2, avgVolume) * 100).toFixed(0)}%`, 10, 65);
};
