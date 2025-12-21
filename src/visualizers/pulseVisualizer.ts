import { VisualizerFunction } from "./types";

/**
 * PULSE VISUALIZER
 * 
 * Pulsing concentric rings that react to relative bass changes and beats
 */

interface Ring {
  radius: number;
  maxRadius: number;
  alpha: number;
  hue: number;
  lineWidth: number;
  speed: number;
}

const rings: Ring[] = [];
let lastBass = 0;
let avgBass = 0.3;
let avgVolume = 0.3;
let peakBass = 0.5;
let lastBassChange = 0;

export const pulseVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics
) => {
  // Update running averages
  const smoothing = 0.92;
  avgBass = avgBass * smoothing + metrics.bass * (1 - smoothing);
  avgVolume = avgVolume * smoothing + metrics.volume * (1 - smoothing);
  
  if (metrics.bass > peakBass) peakBass = metrics.bass;
  peakBass = Math.max(0.25, peakBass * 0.997);
  
  // Calculate relative values
  const relBass = Math.min(2.5, (metrics.bass - avgBass * 0.5) / Math.max(0.1, avgBass));
  const normalizedBass = metrics.bass / Math.max(0.2, peakBass);
  const bassChange = metrics.bass - lastBass;
  
  // Dark background with fade
  ctx.fillStyle = "rgba(10, 10, 10, 0.12)";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.sqrt(width * width + height * height) / 2;

  // Spawn new ring on relative bass hits (sudden increases)
  const bassHitThreshold = 0.08 + avgBass * 0.15;
  if (bassChange > bassHitThreshold && relBass > 0.2 && time - lastBassChange > 0.08) {
    rings.push({
      radius: 15,
      maxRadius: maxRadius,
      alpha: 0.8 + relBass * 0.2,
      hue: 180 + Math.random() * 60,
      lineWidth: 2 + relBass * 4,
      speed: 2 + relBass * 3,
    });
    lastBassChange = time;
  }
  lastBass = metrics.bass;

  // Update and draw rings
  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    
    // Expand ring - speed based on its initial energy
    ring.radius += ring.speed * (1 + normalizedBass * 0.5);
    ring.alpha *= 0.975;
    
    // Remove faded rings
    if (ring.alpha < 0.01 || ring.radius > ring.maxRadius) {
      rings.splice(i, 1);
      continue;
    }
    
    // Draw ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${ring.hue}, 100%, 50%, ${ring.alpha})`;
    ctx.lineWidth = ring.lineWidth * ring.alpha;
    ctx.stroke();
    
    // Add glow
    ctx.shadowColor = `hsla(${ring.hue}, 100%, 50%, ${ring.alpha * 0.4})`;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Draw center core - responds to normalized bass
  const coreSize = 20 + normalizedBass * 40 + Math.max(0, relBass) * 20;
  
  // Core glow
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, coreSize
  );
  gradient.addColorStop(0, `hsla(180, 100%, 70%, ${0.6 + normalizedBass * 0.3})`);
  gradient.addColorStop(0.5, `hsla(200, 100%, 50%, ${0.3 + Math.max(0, relBass) * 0.3})`);
  gradient.addColorStop(1, "transparent");
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
  ctx.fill();

  // Inner core pulses with relative bass
  const innerSize = 10 + normalizedBass * 15 + Math.max(0, relBass) * 10;
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerSize, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(0, 0%, 100%, ${0.5 + normalizedBass * 0.4})`;
  ctx.fill();

  // Draw frequency bars around core - normalized per-bar
  const numBars = 32;
  const angleStep = (Math.PI * 2) / numBars;
  const barBaseRadius = coreSize + 8;
  
  for (let i = 0; i < numBars; i++) {
    const frequencyIndex = Math.floor((i / numBars) * frequencyData.length);
    const rawValue = frequencyData[frequencyIndex] / 255;
    
    // Normalize bar value
    const normalizedValue = Math.min(1.5, rawValue / 0.4);
    const angle = i * angleStep - Math.PI / 2;
    
    const barLength = normalizedValue * 40;
    const x1 = centerX + Math.cos(angle) * barBaseRadius;
    const y1 = centerY + Math.sin(angle) * barBaseRadius;
    const x2 = centerX + Math.cos(angle) * (barBaseRadius + barLength);
    const y2 = centerY + Math.sin(angle) * (barBaseRadius + barLength);
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `hsla(${180 + i * 3}, 100%, 50%, ${0.3 + normalizedValue * 0.5})`;
    ctx.lineWidth = 2 + normalizedValue;
    ctx.stroke();
  }
};
