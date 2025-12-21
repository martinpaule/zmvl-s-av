import { SpotifyPlayer } from "./SpotifyPlayer";
import { TrackList } from "./TrackList";
import { useLanguage } from "@/contexts/LanguageContext";

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
            className="font-display text-5xl md:text-6xl text-foreground mb-4"
          >
            {t("listen").toUpperCase()}
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-muted-foreground text-center font-mono text-sm">
            {t("spotifyDescription")}
          </p>
          
          <TrackList />
          
          <div className="border border-border p-4 bg-card">
            <SpotifyPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}
