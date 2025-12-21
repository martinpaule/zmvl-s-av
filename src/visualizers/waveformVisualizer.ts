import { VisualizerFunction } from "./types";

/**
 * WAVEFORM VISUALIZER
 * 
 * Displays the audio waveform as a continuous line oscilloscope-style
 */
export const waveformVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics,
  waveformData
) => {
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
  
  // Glow effect
  ctx.shadowColor = `hsla(180, 100%, 50%, ${0.5 + metrics.volume * 0.5})`;
  ctx.shadowBlur = 15 + metrics.bass * 20;
  
  // Main waveform line
  ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.7 + metrics.volume * 0.3})`;
  ctx.lineWidth = 2 + metrics.bass * 2;
  ctx.beginPath();
  
  let x = 0;
  for (let i = 0; i < waveformData.length; i++) {
    const v = waveformData[i] / 128.0;
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

  // Second line with offset for depth
  ctx.strokeStyle = `hsla(75, 100%, 50%, ${0.3 + metrics.treble * 0.3})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  
  x = 0;
  for (let i = 0; i < waveformData.length; i++) {
    const v = waveformData[i] / 128.0;
    const y = (v * height) / 2 + 5;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    x += sliceWidth;
  }
  
  ctx.stroke();
};
