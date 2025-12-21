import { VisualizerFunction } from "./types";

/**
 * OSCILLOSCOPE VISUALIZER
 * 
 * Classic oscilloscope display showing the waveform in real-time
 */
export const oscilloscopeVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics,
  waveformData
) => {
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

  // Draw waveform
  if (waveformData && waveformData.length > 0) {
    ctx.strokeStyle = `hsla(120, 100%, 50%, ${0.7 + metrics.volume * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const sliceWidth = width / waveformData.length;
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
    
    // Add glow effect
    ctx.shadowColor = "hsla(120, 100%, 50%, 0.5)";
    ctx.shadowBlur = 10 + metrics.volume * 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Draw measurement info
  ctx.fillStyle = "hsla(120, 100%, 50%, 0.8)";
  ctx.font = "12px monospace";
  ctx.fillText(`VOL: ${(metrics.volume * 100).toFixed(0)}%`, 10, 20);
  ctx.fillText(`BASS: ${(metrics.bass * 100).toFixed(0)}%`, 10, 35);
  ctx.fillText(`MID: ${(metrics.mid * 100).toFixed(0)}%`, 10, 50);
  ctx.fillText(`TREBLE: ${(metrics.treble * 100).toFixed(0)}%`, 10, 65);
};
