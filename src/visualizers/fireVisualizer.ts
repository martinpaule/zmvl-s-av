import { VisualizerFunction } from "./types";

/**
 * FIRE VISUALIZER
 * 
 * Flame effect that reacts to audio intensity
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

export const fireVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics
) => {
  // Dark background with fast fade for fire trail
  ctx.fillStyle = "rgba(10, 5, 0, 0.2)";
  ctx.fillRect(0, 0, width, height);

  // Spawn particles based on audio
  const spawnCount = Math.floor(5 + metrics.volume * 20 + metrics.bass * 15);
  for (let i = 0; i < spawnCount; i++) {
    const x = width * 0.3 + Math.random() * width * 0.4;
    particles.push({
      x,
      y: height,
      vx: (Math.random() - 0.5) * 3,
      vy: -2 - Math.random() * 3 - metrics.bass * 4,
      life: 1,
      maxLife: 0.8 + Math.random() * 0.4,
      size: 3 + Math.random() * 5 + metrics.bass * 5,
    });
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    
    // Physics
    p.x += p.vx;
    p.y += p.vy;
    p.vx += (Math.random() - 0.5) * 0.5; // Turbulence
    p.vy += -0.05; // Slight upward acceleration
    p.life -= 0.02;
    
    // Remove dead particles
    if (p.life <= 0 || p.y < 0) {
      particles.splice(i, 1);
      continue;
    }
    
    // Calculate color based on life (hot to cool)
    const lifeRatio = p.life / p.maxLife;
    let hue: number;
    let lightness: number;
    
    if (lifeRatio > 0.7) {
      // Hot white/yellow core
      hue = 60;
      lightness = 90;
    } else if (lifeRatio > 0.4) {
      // Orange
      hue = 30;
      lightness = 60;
    } else {
      // Red to dark red
      hue = 10;
      lightness = 40 * lifeRatio;
    }
    
    // Draw particle
    const size = p.size * lifeRatio;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${lifeRatio * 0.8})`;
    ctx.fill();
    
    // Add glow for hot particles
    if (lifeRatio > 0.5) {
      ctx.shadowColor = `hsla(${hue}, 100%, ${lightness}%, 0.5)`;
      ctx.shadowBlur = size * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Limit particle count
  while (particles.length > 500) {
    particles.shift();
  }

  // Draw frequency bars at bottom as fire base
  const barWidth = width / frequencyData.length;
  for (let i = 0; i < frequencyData.length; i++) {
    const value = frequencyData[i] / 255;
    const barHeight = value * height * 0.2;
    const x = i * barWidth;
    const y = height - barHeight;
    
    const gradient = ctx.createLinearGradient(x, height, x, y);
    gradient.addColorStop(0, `hsla(30, 100%, 50%, ${0.5 + value * 0.5})`);
    gradient.addColorStop(1, "transparent");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
  }

  // Add ambient glow at bottom
  const ambientGradient = ctx.createLinearGradient(0, height, 0, height - 100);
  ambientGradient.addColorStop(0, `hsla(25, 100%, 30%, ${0.3 + metrics.bass * 0.3})`);
  ambientGradient.addColorStop(1, "transparent");
  ctx.fillStyle = ambientGradient;
  ctx.fillRect(0, height - 100, width, 100);
};
