import { useLanguage } from "@/contexts/LanguageContext";
import { AudioPlayer } from "./AudioPlayer";
import { AlbumTrackList } from "./AlbumTrackList";

// Spotify icon component
function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
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
          
          {/* Album Track List */}
          <AlbumTrackList />
          
          {/* Spotify Link */}
          <div className="pt-8 border-t border-border">
            <a 
              href="https://open.spotify.com/artist/5M52tdBnJaKSvOpJGz8mfZ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 text-muted-foreground hover:text-foreground transition-colors font-mono text-sm group"
            >
              <SpotifyIcon className="w-6 h-6 text-[#1DB954] group-hover:scale-110 transition-transform" />
              <span>{t("spotifyDescription")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
