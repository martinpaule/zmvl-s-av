import { useState } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { albums, Track } from "@/data/albumSongs";
import { ChevronDown, ChevronRight, Play, Disc } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AlbumSectionProps {
  album: typeof albums[0];
  isOpen: boolean;
  onToggle: () => void;
}

function AlbumSection({ album, isOpen, onToggle }: AlbumSectionProps) {
  const { currentTrack, isPlaying, selectTrack } = useAudioPlayer();

  const handleTrackClick = (track: Track) => {
    selectTrack(track);
  };

  const hasActiveTrack = album.tracks.some((t) => t.id === currentTrack?.id);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div 
          className={`
            flex items-center justify-between p-4 border-2 transition-all duration-200
            ${hasActiveTrack 
              ? "border-primary bg-primary/5" 
              : "border-border bg-card hover:border-muted-foreground hover:bg-secondary/30"
            }
          `}
        >
          <div className="flex items-center gap-3">
            {isOpen ? (
              <ChevronDown size={18} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={18} className="text-muted-foreground" />
            )}
            <div className="text-left">
              <h4 className="font-heading text-base text-foreground">
                {album.title}
              </h4>
              {album.description && (
                <p className="font-mono text-xs text-muted-foreground">
                  {album.description}
                </p>
              )}
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {album.tracks.length} {album.tracks.length === 1 ? "track" : "tracks"}
          </span>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="border-x-2 border-b-2 border-border bg-background">
          {album.tracks.map((track, index) => {
            const isActive = currentTrack?.id === track.id;
            
            return (
              <button
                key={track.id}
                onClick={() => handleTrackClick(track)}
                className={`
                  w-full text-left p-3 border-b border-border/50 last:border-b-0 
                  transition-all duration-200 group
                  ${isActive 
                    ? "bg-primary/10" 
                    : "hover:bg-secondary/50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Track Number / Play Icon */}
                  <div className={`
                    w-6 h-6 flex items-center justify-center flex-shrink-0
                    ${isActive ? "text-primary" : "text-muted-foreground"}
                  `}>
                    {isActive && isPlaying ? (
                      <Disc size={16} className="animate-spin" />
                    ) : (
                      <span className="font-mono text-xs group-hover:hidden">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                    {!isActive && (
                      <Play 
                        size={14} 
                        className="hidden group-hover:block"
                      />
                    )}
                  </div>

                  {/* Track Title */}
                  <span className={`
                    font-mono text-sm truncate
                    ${isActive ? "text-primary" : "text-foreground"}
                  `}>
                    {track.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AlbumTrackList() {
  const { t } = useLanguage();
  const [openAlbums, setOpenAlbums] = useState<string[]>([]);

  const toggleAlbum = (albumId: string) => {
    setOpenAlbums((prev) =>
      prev.includes(albumId)
        ? prev.filter((id) => id !== albumId)
        : [...prev, albumId]
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-sm uppercase tracking-widest text-primary">
        {t("recordings")}
      </h3>
      
      <div className="space-y-2">
        {albums.map((album) => (
          <AlbumSection
            key={album.id}
            album={album}
            isOpen={openAlbums.includes(album.id)}
            onToggle={() => toggleAlbum(album.id)}
          />
        ))}
      </div>
    </div>
  );
}
