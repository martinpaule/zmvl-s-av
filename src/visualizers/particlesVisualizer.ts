import { VisualizerFunction } from "./types";

/**
 * PARTICLES VISUALIZER
 * 
 * Displays reactive particles that respond to audio
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

// Particle pool - persistent across frames
let particles: Particle[] = [];
const MAX_PARTICLES = 150;

const createParticle = (width: number, height: number, metrics: { bass: number; treble: number }): Particle => {
  const angle = Math.random() * Math.PI * 2;
  const speed = 1 + metrics.bass * 3;
  
  return {
    x: width / 2,
    y: height / 2,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 1,
    maxLife: 60 + Math.random() * 60,
    size: 2 + Math.random() * 4 + metrics.treble * 4,
    hue: 180 - Math.random() * 105, // Cyan to lime
  };
};

export const particlesVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics
) => {
  // Semi-transparent clear for trail effect
  ctx.fillStyle = "hsla(0, 0%, 4%, 0.15)";
  ctx.fillRect(0, 0, width, height);

  // Spawn particles based on audio intensity
  const spawnRate = Math.floor(1 + metrics.volume * 5);
  for (let i = 0; i < spawnRate && particles.length < MAX_PARTICLES; i++) {
    particles.push(createParticle(width, height, metrics));
  }

  // Update and draw particles
  particles = particles.filter((p) => {
    // Update position
    p.x += p.vx * (1 + metrics.bass * 2);
    p.y += p.vy * (1 + metrics.bass * 2);
    
    // Update velocity based on audio
    p.vx *= 0.98 + metrics.treble * 0.02;
    p.vy *= 0.98 + metrics.treble * 0.02;
    
    // Update life
    p.life -= 1 / p.maxLife;
    
    // Draw
    const alpha = p.life * (0.5 + metrics.volume * 0.5);
    const size = p.size * (0.5 + p.life * 0.5);
    
    ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${alpha})`;
    
    // Glow for larger particles
    if (size > 4) {
      ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, ${alpha})`;
      ctx.shadowBlur = size * 2;
    }
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    return p.life > 0;
  });

  // Draw center pulse
  const pulseSize = 20 + metrics.bass * 40;
  ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.3 + metrics.volume * 0.4})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, pulseSize, 0, Math.PI * 2);
  ctx.stroke();
};
