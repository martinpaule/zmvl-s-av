import { SpotifyPlayer } from "./SpotifyPlayer";
import { TrackList } from "./TrackList";
import { VisualizerCanvas } from "./VisualizerCanvas";
import { useMusic } from "@/contexts/MusicContext";
import { Radio } from "lucide-react";

export function Listen() {
  const { isPlaying, setIsPlaying } = useMusic();

  return (
    <section 
      id="listen" 
      className="py-24 md:py-32 bg-background"
      aria-labelledby="listen-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16">
          <h2 
            id="listen-heading"
            className="font-display text-5xl md:text-6xl text-foreground mb-4"
          >
            LISTEN
          </h2>
          <div className="w-24 h-1 bg-accent" aria-hidden="true" />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Track List + Player */}
          <div className="space-y-6">
            <TrackList />
            
            <div className="border border-border p-4 bg-card">
              <SpotifyPlayer />
            </div>

            {/* Play State Toggle (for visualizer demo) */}
            <div className="flex items-center gap-4 p-4 border border-border bg-secondary/30">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`
                  px-4 py-2 font-mono text-xs uppercase tracking-wider border-2 transition-all
                  ${isPlaying 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground"
                  }
                `}
              >
                {isPlaying ? "Stop Visualizer" : "Start Visualizer"}
              </button>
              <span className="font-mono text-xs text-muted-foreground">
                Toggle to preview visualizer
              </span>
            </div>
          </div>

          {/* Right: Visualizer */}
          <div className="space-y-4">
            {/* Visualizer Header */}
            <div className="flex items-center gap-3">
              <Radio size={20} className={`${isPlaying ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
              <div>
                <h3 className="font-heading text-sm uppercase tracking-widest text-foreground">
                  Live Visualizer
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  Real-time audio visualization
                </p>
              </div>
            </div>

            {/* Visualizer Canvas */}
            <div className="aspect-video border-2 border-border bg-card overflow-hidden box-glow">
              <VisualizerCanvas />
            </div>

            {/* Visualizer Info */}
            <div className="p-4 border border-border bg-secondary/30">
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                Procedural audio visualization responding to simulated frequency data. 
                The visualizer reacts to bass, mid, and treble frequencies with 
                geometric forms and neon accents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
