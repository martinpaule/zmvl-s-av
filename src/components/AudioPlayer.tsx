import { useState } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { VisualizerCanvas } from "./VisualizerCanvas";
import { barsVisualizer } from "@/visualizers/barsVisualizer";
import { waveformVisualizer } from "@/visualizers/waveformVisualizer";
import { circularVisualizer } from "@/visualizers/circularVisualizer";
import { particlesVisualizer } from "@/visualizers/particlesVisualizer";
import { spectrumVisualizer } from "@/visualizers/spectrumVisualizer";
import { matrixVisualizer } from "@/visualizers/matrixVisualizer";
import { galaxyVisualizer } from "@/visualizers/galaxyVisualizer";
import { oscilloscopeVisualizer } from "@/visualizers/oscilloscopeVisualizer";
import { pulseVisualizer } from "@/visualizers/pulseVisualizer";
import { fireVisualizer } from "@/visualizers/fireVisualizer";
import { VisualizerFunction } from "@/visualizers/types";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VISUALIZERS: { id: string; name: string; fn: VisualizerFunction }[] = [
  { id: "bars", name: "Bars", fn: barsVisualizer },
  { id: "waveform", name: "Waveform", fn: waveformVisualizer },
  { id: "circular", name: "Circular", fn: circularVisualizer },
  { id: "particles", name: "Particles", fn: particlesVisualizer },
  { id: "spectrum", name: "Spectrum", fn: spectrumVisualizer },
  { id: "matrix", name: "Matrix", fn: matrixVisualizer },
  { id: "galaxy", name: "Galaxy", fn: galaxyVisualizer },
  { id: "oscilloscope", name: "Oscilloscope", fn: oscilloscopeVisualizer },
  { id: "pulse", name: "Pulse", fn: pulseVisualizer },
  { id: "fire", name: "Fire", fn: fireVisualizer },
];

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer() {
  const { t } = useLanguage();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    setVolume,
    playNext,
    playPrevious,
    shuffleMode,
    toggleShuffleMode,
  } = useAudioPlayer();
  
  const [selectedVisualizer, setSelectedVisualizer] = useState("bars");
  const currentVisualizerFn = VISUALIZERS.find((v) => v.id === selectedVisualizer)?.fn || barsVisualizer;

  return (
    <div className="w-full space-y-4">
      {/* Visualizer + Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visualizer */}
        <div className="relative border-2 border-border bg-card aspect-video lg:aspect-auto lg:h-64 overflow-hidden">
          <VisualizerCanvas visualizer={currentVisualizerFn} />
          
          {/* Visualizer selector overlay */}
          <div className="absolute top-3 right-3 z-10">
            <Select value={selectedVisualizer} onValueChange={setSelectedVisualizer}>
              <SelectTrigger className="w-32 h-8 text-xs bg-background/90 backdrop-blur border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {VISUALIZERS.map((viz) => (
                  <SelectItem key={viz.id} value={viz.id} className="text-xs">
                    {viz.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Now playing overlay */}
          {currentTrack && (
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <p className="font-heading text-sm text-foreground truncate">
                {currentTrack.title}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col justify-center space-y-4 p-4 border-2 border-border bg-card">
          {/* Track info */}
          <div className="text-center">
            <p className="font-heading text-lg text-foreground truncate">
              {currentTrack?.title || t("noTrackSelected")}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {currentTrack ? "ZMVL" : "—"}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={([value]) => seek(value)}
              className="cursor-pointer"
            />
            <div className="flex justify-between font-mono text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleShuffleMode}
              className={`p-2 transition-colors ${
                shuffleMode ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={shuffleMode ? "Switch to linear play" : "Switch to shuffle"}
              title={shuffleMode ? "Shuffle" : "Linear"}
            >
              {shuffleMode ? <Shuffle size={18} /> : <ArrowRight size={18} />}
            </button>
            
            <button
              onClick={playPrevious}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous track"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-4 border-2 border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              onClick={playNext}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next track"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={([value]) => setVolume(value)}
              className="flex-1 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
