import { VisualizerFunction } from "./types";

/**
 * FIRE VISUALIZER
 * 
 * Flame effect that reacts to relative audio changes
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const particles: Particle[] = [];

// Running averages for normalization
let avgBass = 0.3;
let avgVolume = 0.3;
let peakBass = 0.5;
let peakVolume = 0.5;

export const fireVisualizer: VisualizerFunction = (
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
  if (metrics.volume > peakVolume) peakVolume = metrics.volume;
  peakBass = Math.max(0.25, peakBass * 0.997);
  peakVolume = Math.max(0.2, peakVolume * 0.998);
  
  // Calculate relative values
  const relBass = Math.min(2, (metrics.bass - avgBass * 0.5) / Math.max(0.1, avgBass));
  const relVolume = Math.min(2, (metrics.volume - avgVolume * 0.5) / Math.max(0.1, avgVolume));
  const normalizedBass = metrics.bass / Math.max(0.2, peakBass);
  const normalizedVolume = metrics.volume / Math.max(0.15, peakVolume);
  
  // Dark background with fast fade for fire trail
  ctx.fillStyle = "rgba(10, 5, 0, 0.18)";
  ctx.fillRect(0, 0, width, height);

  // Spawn particles based on relative audio (responds to changes)
  const baseSpawn = 3;
  const relativeSpawn = Math.max(0, relVolume) * 12 + Math.max(0, relBass) * 10;
  const normalizedSpawn = normalizedVolume * 8;
  const spawnCount = Math.floor(baseSpawn + relativeSpawn + normalizedSpawn);
  
  for (let i = 0; i < spawnCount; i++) {
    const x = width * 0.3 + Math.random() * width * 0.4;
    const baseVy = -1.5 - Math.random() * 2;
    const boostVy = -Math.max(0, relBass) * 3 - normalizedBass * 1.5;
    
    particles.push({
      x,
      y: height,
      vx: (Math.random() - 0.5) * 2,
      vy: baseVy + boostVy,
      life: 1,
      maxLife: 0.7 + Math.random() * 0.4,
      size: 2 + Math.random() * 3 + Math.max(0, relBass) * 3 + normalizedBass * 2,
    });
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    
    // Physics - speed affected by relative audio
    const speedMult = 1 + Math.max(0, relVolume) * 0.4;
    p.x += p.vx * speedMult;
    p.y += p.vy * speedMult;
    p.vx += (Math.random() - 0.5) * 0.4; // Turbulence
    p.vy += -0.03; // Slight upward acceleration
    p.life -= 0.018;
    
    // Remove dead particles
    if (p.life <= 0 || p.y < 0) {
      particles.splice(i, 1);
      continue;
    }
    
    // Calculate color based on life (hot to cool)
    const lifeRatio = p.life / p.maxLife;
    let hue: number;
    let lightness: number;
    
    // Color intensity responds to relative audio
    const intensityBoost = Math.max(0, relVolume) * 10;
    
    if (lifeRatio > 0.7) {
      hue = 60;
      lightness = 85 + intensityBoost;
    } else if (lifeRatio > 0.4) {
      hue = 30 + Math.max(0, relBass) * 10;
      lightness = 55 + intensityBoost;
    } else {
      hue = 10;
      lightness = 35 * lifeRatio + intensityBoost * 0.5;
    }
    
    // Draw particle - size pulses with relative audio
    const sizeMult = 1 + Math.max(0, relBass) * 0.3;
    const size = p.size * lifeRatio * sizeMult;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(1, size), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 100%, ${Math.min(100, lightness)}%, ${lifeRatio * 0.75})`;
    ctx.fill();
    
    // Add glow for hot particles
    if (lifeRatio > 0.5) {
      ctx.shadowColor = `hsla(${hue}, 100%, ${lightness}%, 0.4)`;
      ctx.shadowBlur = size * 1.5;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Limit particle count
  while (particles.length > 400) {
    particles.shift();
  }

  // Draw frequency bars at bottom as fire base - normalized
  const barWidth = width / frequencyData.length;
  for (let i = 0; i < frequencyData.length; i++) {
    const rawValue = frequencyData[i] / 255;
    const normalizedValue = Math.min(1.2, rawValue / 0.35);
    const barHeight = normalizedValue * height * 0.18;
    const x = i * barWidth;
    const y = height - barHeight;
    
    const gradient = ctx.createLinearGradient(x, height, x, y);
    gradient.addColorStop(0, `hsla(30, 100%, 50%, ${0.4 + normalizedValue * 0.4})`);
    gradient.addColorStop(1, "transparent");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
  }

  // Add ambient glow at bottom - responds to relative bass
  const glowIntensity = 0.2 + normalizedBass * 0.2 + Math.max(0, relBass) * 0.15;
  const ambientGradient = ctx.createLinearGradient(0, height, 0, height - 80);
  ambientGradient.addColorStop(0, `hsla(25, 100%, 30%, ${glowIntensity})`);
  ambientGradient.addColorStop(1, "transparent");
  ctx.fillStyle = ambientGradient;
  ctx.fillRect(0, height - 80, width, 80);
};
