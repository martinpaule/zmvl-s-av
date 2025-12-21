import { VisualizerFunction } from "./types";

/**
 * PARTICLES VISUALIZER
 * 
 * Displays reactive particles that respond to relative audio changes
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
  baseSpeed: number;
}

// Particle pool - persistent across frames
let particles: Particle[] = [];
const MAX_PARTICLES = 150;

// Running averages for normalization
let avgBass = 0.3;
let avgTreble = 0.3;
let avgVolume = 0.3;
let peakBass = 0.5;

const createParticle = (width: number, height: number, relBass: number, relTreble: number): Particle => {
  const angle = Math.random() * Math.PI * 2;
  const baseSpeed = 0.8 + Math.random() * 1.2;
  
  return {
    x: width / 2,
    y: height / 2,
    vx: Math.cos(angle) * baseSpeed,
    vy: Math.sin(angle) * baseSpeed,
    life: 1,
    maxLife: 60 + Math.random() * 60,
    size: 2 + Math.random() * 3 + relTreble * 3,
    hue: 180 - Math.random() * 105, // Cyan to lime
    baseSpeed,
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
  // Update running averages (smoothed)
  const smoothing = 0.95;
  avgBass = avgBass * smoothing + metrics.bass * (1 - smoothing);
  avgTreble = avgTreble * smoothing + metrics.treble * (1 - smoothing);
  avgVolume = avgVolume * smoothing + metrics.volume * (1 - smoothing);
  
  // Track peak for normalization
  if (metrics.bass > peakBass) peakBass = metrics.bass;
  peakBass = Math.max(0.3, peakBass * 0.999); // Slow decay
  
  // Calculate relative values (how different from average)
  const relBass = Math.min(2, (metrics.bass - avgBass * 0.7) / Math.max(0.1, avgBass));
  const relTreble = Math.min(2, (metrics.treble - avgTreble * 0.7) / Math.max(0.1, avgTreble));
  const relVolume = Math.min(2, (metrics.volume - avgVolume * 0.5) / Math.max(0.1, avgVolume));
  const normalizedBass = metrics.bass / Math.max(0.2, peakBass);

  // Semi-transparent clear for trail effect
  ctx.fillStyle = "hsla(0, 0%, 4%, 0.12)";
  ctx.fillRect(0, 0, width, height);

  // Spawn particles based on relative audio intensity (more responsive to changes)
  const spawnRate = Math.floor(1 + Math.max(0, relBass) * 4 + Math.max(0, relVolume) * 2);
  for (let i = 0; i < spawnRate && particles.length < MAX_PARTICLES; i++) {
    particles.push(createParticle(width, height, Math.max(0, relBass), Math.max(0, relTreble)));
  }

  // Update and draw particles
  particles = particles.filter((p) => {
    // Speed multiplier based on relative bass (responds to changes)
    const speedMult = 1 + Math.max(0, relBass) * 1.5 + normalizedBass * 0.5;
    
    // Update position
    p.x += p.vx * speedMult;
    p.y += p.vy * speedMult;
    
    // Accelerate on treble hits
    const accel = 1 + Math.max(0, relTreble) * 0.03;
    p.vx *= 0.97 * accel;
    p.vy *= 0.97 * accel;
    
    // Update life
    p.life -= 1 / p.maxLife;
    
    // Draw - size pulses with relative volume
    const sizeMult = 0.7 + Math.max(0, relVolume) * 0.5 + normalizedBass * 0.3;
    const alpha = p.life * (0.6 + normalizedBass * 0.4);
    const size = p.size * (0.5 + p.life * 0.5) * sizeMult;
    
    ctx.fillStyle = `hsla(${p.hue}, 100%, ${50 + Math.max(0, relTreble) * 20}%, ${alpha})`;
    
    // Glow for larger particles
    if (size > 3) {
      ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${alpha * 0.7})`;
      ctx.shadowBlur = size * 2;
    }
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(1, size), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    return p.life > 0;
  });

  // Draw center pulse - responds to normalized bass
  const pulseSize = 15 + normalizedBass * 35 + Math.max(0, relBass) * 20;
  ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.2 + normalizedBass * 0.5})`;
  ctx.lineWidth = 2 + Math.max(0, relBass) * 2;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, pulseSize, 0, Math.PI * 2);
  ctx.stroke();
};
