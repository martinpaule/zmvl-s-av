import { useMusic } from "@/contexts/MusicContext";

export function SpotifyPlayer() {
  const { currentTrack } = useMusic();

  if (!currentTrack) {
    return (
      <div className="w-full h-20 bg-card border border-border flex items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">Select a track to play</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <iframe
        src={`https://open.spotify.com/embed/track/${currentTrack.spotifyTrackId}?utm_source=generator&theme=0`}
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
