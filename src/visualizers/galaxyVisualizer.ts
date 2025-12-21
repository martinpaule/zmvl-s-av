import { VisualizerFunction } from "./types";

/**
 * GALAXY VISUALIZER
 * 
 * Swirling galaxy/nebula effect with stars reactive to audio
 */

interface Star {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  hue: number;
}

const stars: Star[] = [];

export const galaxyVisualizer: VisualizerFunction = (
  ctx,
  width,
  height,
  time,
  frequencyData,
  metrics
) => {
  // Dark space background with slight fade
  ctx.fillStyle = "rgba(5, 5, 15, 0.15)";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.45;
  
  // Initialize stars
  while (stars.length < 200) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * maxRadius;
    stars.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle,
      radius,
      speed: 0.002 + Math.random() * 0.005,
      size: 1 + Math.random() * 2,
      hue: Math.random() > 0.5 ? 180 : 280, // Cyan or purple
    });
  }

  // Draw nebula glow based on audio
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, maxRadius * (0.8 + metrics.bass * 0.4)
  );
  gradient.addColorStop(0, `hsla(280, 80%, 30%, ${0.1 + metrics.bass * 0.2})`);
  gradient.addColorStop(0.5, `hsla(200, 80%, 20%, ${0.05 + metrics.mid * 0.1})`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Update and draw stars
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    const frequencyIndex = Math.floor((i / stars.length) * frequencyData.length);
    const intensity = frequencyData[frequencyIndex] / 255;
    
    // Rotate around center
    star.angle += star.speed * (1 + metrics.volume);
    
    // Spiral inward/outward based on bass
    star.radius += (metrics.bass - 0.3) * 0.5;
    if (star.radius > maxRadius) star.radius = 10;
    if (star.radius < 10) star.radius = maxRadius;
    
    star.x = centerX + Math.cos(star.angle) * star.radius;
    star.y = centerY + Math.sin(star.angle) * star.radius;
    
    // Draw star with glow
    const size = star.size * (1 + intensity * 2);
    const alpha = 0.5 + intensity * 0.5;
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${star.hue}, 100%, ${60 + intensity * 40}%, ${alpha})`;
    ctx.fill();
    
    // Add glow for bright stars
    if (intensity > 0.5) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${star.hue}, 100%, 70%, ${intensity * 0.3})`;
      ctx.fill();
    }
  }

  // Draw center core
  const coreSize = 20 + metrics.bass * 40;
  const coreGradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, coreSize
  );
  coreGradient.addColorStop(0, `hsla(0, 0%, 100%, ${0.8 + metrics.volume * 0.2})`);
  coreGradient.addColorStop(0.3, `hsla(280, 100%, 70%, ${0.5 + metrics.treble * 0.3})`);
  coreGradient.addColorStop(1, "transparent");
  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
  ctx.fill();
};
