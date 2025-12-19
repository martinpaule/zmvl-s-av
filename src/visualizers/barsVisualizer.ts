import { VisualizerFunction } from "./types";

/**
 * DEFAULT BARS VISUALIZER
 * 
 * A brutalist bar visualization with:
 * - Bold geometric bars
 * - High-contrast neon-on-black palette
 * - Snappy, mechanical motion
 * - Reactive to bass, mid, and treble
 * 
 * To replace this visualizer:
 * 1. Create a new visualizer function in src/visualizers/
 * 2. Import it in VisualizerCanvas.tsx
 * 3. Pass it as the `visualizer` prop
 */

export const barsVisualizer: VisualizerFunction = (
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

  // Draw grid lines for brutalist effect
  ctx.strokeStyle = "hsl(0, 0%, 10%)";
  ctx.lineWidth = 1;
  
  const gridSpacing = 40;
  for (let x = 0; x < width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const numBars = frequencyData.length;
  const barWidth = (width / numBars) * 0.8;
  const gap = (width / numBars) * 0.2;

  // Color based on frequency range
  const getCyanColor = (intensity: number) => 
    `hsla(180, 100%, 50%, ${0.7 + intensity * 0.3})`;
  const getLimeColor = (intensity: number) => 
    `hsla(75, 100%, 50%, ${0.7 + intensity * 0.3})`;

  for (let i = 0; i < numBars; i++) {
    const value = frequencyData[i] / 255;
    const barHeight = value * height * 0.8;
    const x = i * (barWidth + gap) + gap / 2;
    const y = height - barHeight;

    // Determine color based on frequency range
    const normalizedBin = i / numBars;
    let color: string;
    
    if (normalizedBin < 0.33) {
      // Bass - cyan
      color = getCyanColor(value);
    } else if (normalizedBin < 0.66) {
      // Mid - gradient between cyan and lime
      const blend = (normalizedBin - 0.33) / 0.33;
      color = `hsla(${180 - blend * 105}, 100%, 50%, ${0.7 + value * 0.3})`;
    } else {
      // Treble - lime
      color = getLimeColor(value);
    }

    // Main bar
    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Glow effect for high values
    if (value > 0.6) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 20 * value;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.shadowBlur = 0;
    }

    // Top cap for brutalist effect
    ctx.fillStyle = "hsl(0, 0%, 95%)";
    ctx.fillRect(x, y - 3, barWidth, 3);
  }

  // Add reactive center element based on bass
  const centerX = width / 2;
  const centerY = height / 2;
  const pulseSize = 50 + metrics.bass * 100;
  
  ctx.strokeStyle = getCyanColor(metrics.bass);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.rect(centerX - pulseSize / 2, centerY - pulseSize / 2, pulseSize, pulseSize);
  ctx.stroke();

  // Inner square
  const innerSize = pulseSize * 0.6;
  ctx.strokeStyle = getLimeColor(metrics.treble);
  ctx.beginPath();
  ctx.rect(centerX - innerSize / 2, centerY - innerSize / 2, innerSize, innerSize);
  ctx.stroke();

  // Scanline effect
  const scanlineY = (time * 100) % height;
  ctx.fillStyle = "hsla(180, 100%, 50%, 0.1)";
  ctx.fillRect(0, scanlineY, width, 2);
};
