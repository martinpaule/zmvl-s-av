import { useMusic } from "@/contexts/MusicContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Disc } from "lucide-react";

export function TrackList() {
  const { playlist, currentTrack, selectTrack, setIsPlaying } = useMusic();
  const { t } = useLanguage();

  const handleTrackClick = (song: typeof playlist[0]) => {
    selectTrack(song);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-2">
      <h3 className="font-heading text-sm uppercase tracking-widest text-primary mb-4">
        {t("playlist")}
      </h3>
      
      <div className="space-y-1">
        {playlist.map((song, index) => {
          const isActive = currentTrack?.id === song.id;
          
          return (
            <button
              key={song.id}
              onClick={() => handleTrackClick(song)}
              className={`
                w-full text-left p-4 border transition-all duration-200
                ${isActive 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-card hover:border-muted-foreground hover:bg-secondary/50"
                }
              `}
              aria-current={isActive ? "true" : undefined}
            >
              <div className="flex items-center gap-4">
                {/* Track Number / Play Icon */}
                <div className={`
                  w-8 h-8 flex items-center justify-center 
                  ${isActive ? "text-primary" : "text-muted-foreground"}
                `}>
                  {isActive ? (
                    <Disc size={20} className="animate-pulse" />
                  ) : (
                    <span className="font-mono text-sm">{String(index + 1).padStart(2, "0")}</span>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-heading text-base truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                    {song.title}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground truncate">
                    {song.artist}
                  </p>
                </div>

                {/* Duration */}
                {song.duration && (
                  <span className="font-mono text-xs text-muted-foreground">
                    {song.duration}
                  </span>
                )}

                {/* Play Icon on Hover */}
                <Play 
                  size={16} 
                  className={`
                    transition-opacity
                    ${isActive ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-100 text-muted-foreground"}
                  `}
                />
              </div>

              {/* Description */}
              {song.description && (
                <p className="mt-2 ml-12 font-mono text-xs text-muted-foreground">
                  {song.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
