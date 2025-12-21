import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { Track, allTracks, albums } from "@/data/albumSongs";

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioElement: HTMLAudioElement | null;
  analyserNode: AnalyserNode | null;
  selectTrack: (track: Track) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  // Initialize Web Audio API for visualization
  const initializeAudioContext = useCallback(() => {
    if (isInitializedRef.current || !audioRef.current) return;
    
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      isInitializedRef.current = true;
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
  }, []);

  const selectTrack = useCallback((track: Track) => {
    if (!audioRef.current) return;
    
    // Initialize audio context on first user interaction
    initializeAudioContext();
    
    // Resume audio context if suspended
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
    
    setCurrentTrack(track);
    audioRef.current.src = track.audioUrl;
    audioRef.current.load();
    audioRef.current.play().catch(console.error);
  }, [initializeAudioContext]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    
    initializeAudioContext();
    
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
    
    audioRef.current.play().catch(console.error);
  }, [initializeAudioContext]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVol);
    if (audioRef.current) {
      audioRef.current.volume = clampedVol;
    }
  }, []);

  const playNext = useCallback(() => {
    if (!currentTrack) return;
    
    const currentIndex = allTracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % allTracks.length;
    selectTrack(allTracks[nextIndex]);
  }, [currentTrack, selectTrack]);

  const playPrevious = useCallback(() => {
    if (!currentTrack) return;
    
    const currentIndex = allTracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? allTracks.length - 1 : currentIndex - 1;
    selectTrack(allTracks[prevIndex]);
  }, [currentTrack, selectTrack]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        audioElement: audioRef.current,
        analyserNode: analyserRef.current,
        selectTrack,
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
