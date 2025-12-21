import { VisualizerFunction } from "./types";

/**
 * GALAXY VISUALIZER
 * 
 * Swirling galaxy/nebula effect with stars reactive to relative audio changes
 */

interface Star {
  x: number;
  y: number;
  angle: number;
  radius: number;
  baseSpeed: number;
  size: number;
  hue: number;
  orbitDirection: number;
}

const stars: Star[] = [];

// Running averages for normalization
let avgBass = 0.3;
let avgMid = 0.3;
let avgVolume = 0.3;
let peakVolume = 0.5;

export const galaxyVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics
) => {
  // Update running averages
  const smoothing = 0.94;
  avgBass = avgBass * smoothing + metrics.bass * (1 - smoothing);
  avgMid = avgMid * smoothing + metrics.mid * (1 - smoothing);
  avgVolume = avgVolume * smoothing + metrics.volume * (1 - smoothing);
  
  if (metrics.volume > peakVolume) peakVolume = metrics.volume;
  peakVolume = Math.max(0.2, peakVolume * 0.998);
  
  // Calculate relative values
  const relBass = Math.min(2, (metrics.bass - avgBass * 0.6) / Math.max(0.1, avgBass));
  const relMid = Math.min(2, (metrics.mid - avgMid * 0.6) / Math.max(0.1, avgMid));
  const normalizedVolume = metrics.volume / Math.max(0.15, peakVolume);
  
  // Dark space background with slight fade
  ctx.fillStyle = "rgba(5, 5, 15, 0.12)";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.45;
  
  // Initialize stars
  while (stars.length < 200) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * (maxRadius - 20);
    stars.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle,
      radius,
      baseSpeed: 0.003 + Math.random() * 0.006,
      size: 1 + Math.random() * 2,
      hue: Math.random() > 0.5 ? 180 : 280, // Cyan or purple
      orbitDirection: Math.random() > 0.5 ? 1 : -1,
    });
  }

  // Draw nebula glow based on normalized audio
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, maxRadius * (0.7 + normalizedVolume * 0.4)
  );
  gradient.addColorStop(0, `hsla(280, 80%, 30%, ${0.08 + Math.max(0, relBass) * 0.15})`);
  gradient.addColorStop(0.5, `hsla(200, 80%, 20%, ${0.04 + Math.max(0, relMid) * 0.08})`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Update and draw stars
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    const frequencyIndex = Math.floor((i / stars.length) * frequencyData.length);
    const rawIntensity = frequencyData[frequencyIndex] / 255;
    
    // Normalize intensity relative to average
    const avgIntensity = 0.3;
    const relIntensity = Math.min(2, (rawIntensity - avgIntensity * 0.5) / Math.max(0.15, avgIntensity));
    
    // Speed responds to relative changes, not absolute volume
    const speedMult = 1 + Math.max(0, relBass) * 0.8 + normalizedVolume * 0.3;
    star.angle += star.baseSpeed * star.orbitDirection * speedMult;
    
    // Spiral effect based on relative bass
    const spiralEffect = Math.max(0, relBass) * 0.8;
    star.radius += (spiralEffect - 0.2) * 0.3;
    if (star.radius > maxRadius) star.radius = 20;
    if (star.radius < 20) star.radius = maxRadius * 0.8;
    
    star.x = centerX + Math.cos(star.angle) * star.radius;
    star.y = centerY + Math.sin(star.angle) * star.radius;
    
    // Size responds to relative intensity
    const sizeMult = 1 + Math.max(0, relIntensity) * 1.5;
    const size = star.size * sizeMult;
    const alpha = 0.4 + Math.max(0, relIntensity) * 0.4 + normalizedVolume * 0.2;
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${star.hue}, 100%, ${55 + Math.max(0, relIntensity) * 35}%, ${alpha})`;
    ctx.fill();
    
    // Add glow for bright stars
    if (relIntensity > 0.3) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${star.hue}, 100%, 70%, ${relIntensity * 0.2})`;
      ctx.fill();
    }
  }

  // Draw center core - responds to relative bass
  const coreSize = 15 + normalizedVolume * 30 + Math.max(0, relBass) * 25;
  const coreGradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, coreSize
  );
  coreGradient.addColorStop(0, `hsla(0, 0%, 100%, ${0.6 + normalizedVolume * 0.3})`);
  coreGradient.addColorStop(0.3, `hsla(280, 100%, 70%, ${0.3 + Math.max(0, relMid) * 0.4})`);
  coreGradient.addColorStop(1, "transparent");
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
  ctx.fill();
};
