import React, { createContext, useContext, useState, useCallback } from "react";
import { Song, songs } from "@/data/songs";

interface MusicContextType {
  currentTrack: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  selectTrack: (song: Song) => void;
  setIsPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectTrack = useCallback((song: Song) => {
    setCurrentTrack(song);
    setIsPlaying(true);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playlist: songs,
        selectTrack,
        setIsPlaying,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
