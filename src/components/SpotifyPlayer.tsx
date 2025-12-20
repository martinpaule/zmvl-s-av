import { useMusic } from "@/contexts/MusicContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function SpotifyPlayer() {
  const { currentTrack } = useMusic();
  const { t } = useLanguage();

  if (!currentTrack) {
    return (
      <div className="w-full h-[152px] bg-card border border-border flex items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">{t("selectTrack")}</p>
      </div>
    );
  }

  // Key forces iframe to reload when track changes, enabling autoplay
  const embedUrl = `https://open.spotify.com/embed/track/${currentTrack.spotifyTrackId}?utm_source=generator&theme=0`;

  return (
    <div className="w-full">
      <iframe
        key={currentTrack.spotifyTrackId}
        src={embedUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="border-0"
        title={`Spotify player for ${currentTrack.title} by ${currentTrack.artist}`}
      />
    </div>
  );
}
