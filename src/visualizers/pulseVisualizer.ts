import { VisualizerFunction } from "./types";

/**
 * PULSE VISUALIZER
 * 
 * Pulsing concentric rings that react to bass and beats
 */

interface Ring {
  radius: number;
  maxRadius: number;
  alpha: number;
  hue: number;
  lineWidth: number;
}

const rings: Ring[] = [];
let lastBass = 0;

export const pulseVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics
) => {
  // Dark background with fade
  ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.sqrt(width * width + height * height) / 2;

  // Spawn new ring on bass hits
  if (metrics.bass > 0.5 && metrics.bass - lastBass > 0.1) {
    rings.push({
      radius: 20,
      maxRadius: maxRadius,
      alpha: 1,
      hue: 180 + Math.random() * 60, // Cyan to blue range
      lineWidth: 3 + metrics.bass * 5,
    });
  }
  lastBass = metrics.bass;

  // Update and draw rings
  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    
    // Expand ring
    ring.radius += 3 + metrics.volume * 5;
    ring.alpha *= 0.98;
    
    // Remove faded rings
    if (ring.alpha < 0.01 || ring.radius > ring.maxRadius) {
      rings.splice(i, 1);
      continue;
    }
    
    // Draw ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${ring.hue}, 100%, 50%, ${ring.alpha})`;
    ctx.lineWidth = ring.lineWidth;
    ctx.stroke();
    
    // Add glow
    ctx.shadowColor = `hsla(${ring.hue}, 100%, 50%, ${ring.alpha * 0.5})`;
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Draw center core
  const coreSize = 30 + metrics.bass * 50;
  
  // Core glow
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, coreSize
  );
  gradient.addColorStop(0, `hsla(180, 100%, 70%, ${0.8 + metrics.volume * 0.2})`);
  gradient.addColorStop(0.5, `hsla(200, 100%, 50%, ${0.4 + metrics.bass * 0.3})`);
  gradient.addColorStop(1, "transparent");
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
  ctx.fill();

  // Inner core
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15 + metrics.bass * 20, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(0, 0%, 100%, ${0.7 + metrics.volume * 0.3})`;
  ctx.fill();

  // Draw frequency bars around core
  const numBars = 32;
  const angleStep = (Math.PI * 2) / numBars;
  const barBaseRadius = coreSize + 10;
  
  for (let i = 0; i < numBars; i++) {
    const frequencyIndex = Math.floor((i / numBars) * frequencyData.length);
    const value = frequencyData[frequencyIndex] / 255;
    const angle = i * angleStep - Math.PI / 2;
    
    const barLength = value * 50;
    const x1 = centerX + Math.cos(angle) * barBaseRadius;
    const y1 = centerY + Math.sin(angle) * barBaseRadius;
    const x2 = centerX + Math.cos(angle) * (barBaseRadius + barLength);
    const y2 = centerY + Math.sin(angle) * (barBaseRadius + barLength);
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `hsla(${180 + i * 3}, 100%, 50%, ${0.3 + value * 0.7})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
};
