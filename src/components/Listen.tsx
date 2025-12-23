import { useLanguage } from "@/contexts/LanguageContext";
import { AudioPlayer } from "./AudioPlayer";
import { AlbumTrackList } from "./AlbumTrackList";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Shuffle } from "lucide-react";

function PlayRandomButton() {
  const { t } = useLanguage();
  const { playRandom } = useAudioPlayer();

  return (
    <button
      onClick={playRandom}
      className="flex items-center gap-2 px-4 py-2 border-2 border-border bg-card hover:bg-foreground hover:text-background transition-colors font-mono text-sm"
    >
      <Shuffle size={16} />
      <span>{t("playRandom")}</span>
    </button>
  );
}

export function Listen() {
  const { t } = useLanguage();

  return (
    <section 
      id="listen" 
      className="py-24 md:py-32 bg-background"
      aria-labelledby="listen-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 
            id="listen-heading"
            className="font-display text-5xl md:text-6xl text-foreground"
          >
            {t("listen").toUpperCase()}
          </h2>
        </div>

        {/* Music Player & Track List */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Audio Player with Visualizer */}
          <AudioPlayer />
          
          {/* Play Random Button */}
          <div className="flex justify-center">
            <PlayRandomButton />
          </div>
          
          {/* Album Track List */}
          <AlbumTrackList />
          
        </div>
      </div>
    </section>
  );
}
