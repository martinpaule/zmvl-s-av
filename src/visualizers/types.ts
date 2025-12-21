/**
 * VISUALIZER FUNCTION CONTRACT
 * 
 * A visualizer function receives the following parameters and draws to the canvas.
 * 
 * To create a custom visualizer:
 * 1. Create a new file in src/visualizers/
 * 2. Export a function matching this signature
 * 3. Import it in VisualizerCanvas and pass it as the visualizer prop
 * 
 * Available inputs:
 * - ctx: CanvasRenderingContext2D for drawing
 * - width: Canvas width in pixels
 * - height: Canvas height in pixels
 * - time: Time in seconds since visualization started
 * - frequencyData: Uint8Array of frequency values (0-255)
 * - metrics: Derived audio metrics (volume, bass, mid, treble as 0-1 values)
 * - waveformData: Optional Uint8Array of waveform values (0-255)
 */

export interface AudioMetrics {
  volume: number;  // 0-1, overall volume level
  bass: number;    // 0-1, low frequency energy
  mid: number;     // 0-1, mid frequency energy
  treble: number;  // 0-1, high frequency energy
}

export type VisualizerFunction = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  frequencyData: Uint8Array,
  metrics: AudioMetrics,
  waveformData?: Uint8Array
) => void;
