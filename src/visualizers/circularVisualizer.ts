import { VisualizerFunction } from "./types";

/**
 * CIRCULAR VISUALIZER
 * 
 * Displays frequency data in a circular/radial pattern
 */
export const circularVisualizer: VisualizerFunction = (
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

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) * 0.2;
  
  // Draw outer rings
  for (let ring = 3; ring >= 1; ring--) {
    ctx.strokeStyle = `hsla(0, 0%, ${10 + ring * 3}%, 0.3)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius + ring * 30, 0, Math.PI * 2);
    ctx.stroke();
  }

  const numBars = frequencyData.length;
  const angleStep = (Math.PI * 2) / numBars;

  // Draw frequency bars radiating outward
  for (let i = 0; i < numBars; i++) {
    const value = frequencyData[i] / 255;
    const angle = i * angleStep - Math.PI / 2;
    
    const innerRadius = baseRadius;
    const outerRadius = baseRadius + value * Math.min(width, height) * 0.3;
    
    const x1 = centerX + Math.cos(angle) * innerRadius;
    const y1 = centerY + Math.sin(angle) * innerRadius;
    const x2 = centerX + Math.cos(angle) * outerRadius;
    const y2 = centerY + Math.sin(angle) * outerRadius;
    
    // Color based on frequency range
    const normalizedBin = i / numBars;
    let hue: number;
    if (normalizedBin < 0.33) {
      hue = 180; // Cyan for bass
    } else if (normalizedBin < 0.66) {
      hue = 180 - (normalizedBin - 0.33) / 0.33 * 105; // Transition
    } else {
      hue = 75; // Lime for treble
    }
    
    ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${0.5 + value * 0.5})`;
    ctx.lineWidth = 2 + value * 2;
    
    if (value > 0.6) {
      ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.8)`;
      ctx.shadowBlur = 10 * value;
    }
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Draw reactive center circle
  const pulseRadius = baseRadius * (0.8 + metrics.bass * 0.4);
  
  ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.5 + metrics.volume * 0.5})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Inner circle
  ctx.strokeStyle = `hsla(75, 100%, 50%, ${0.3 + metrics.treble * 0.4})`;
  ctx.beginPath();
  ctx.arc(centerX, centerY, pulseRadius * 0.6, 0, Math.PI * 2);
  ctx.stroke();
};
