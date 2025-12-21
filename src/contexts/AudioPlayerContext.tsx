import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { Track, allTracks, albums } from "@/data/albumSongs";

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffleMode: boolean;
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
  toggleShuffleMode: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [shuffleMode, setShuffleMode] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isInitializedRef = useRef(false);
  const shuffleHistoryRef = useRef<string[]>([]);
  const shuffleModeRef = useRef(shuffleMode);
  const currentTrackRef = useRef(currentTrack);
  
  // Keep refs in sync
  useEffect(() => {
    shuffleModeRef.current = shuffleMode;
  }, [shuffleMode]);
  
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

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

  const getRandomTrack = useCallback(() => {
    // Get a random track that hasn't been played recently
    const current = currentTrackRef.current;
    const availableTracks = allTracks.filter(
      (t) => !shuffleHistoryRef.current.includes(t.id) || shuffleHistoryRef.current.length >= allTracks.length - 1
    );
    
    // If all tracks have been played, reset history but keep current track
    if (availableTracks.length === 0 || (availableTracks.length === 1 && availableTracks[0].id === current?.id)) {
      shuffleHistoryRef.current = current ? [current.id] : [];
      return allTracks[Math.floor(Math.random() * allTracks.length)];
    }
    
    // Filter out current track to avoid playing same song twice
    const filteredTracks = availableTracks.filter(t => t.id !== current?.id);
    const tracksToChooseFrom = filteredTracks.length > 0 ? filteredTracks : availableTracks;
    
    const randomIndex = Math.floor(Math.random() * tracksToChooseFrom.length);
    return tracksToChooseFrom[randomIndex];
  }, []);

  const playNext = useCallback(() => {
    const isShuffleMode = shuffleModeRef.current;
    const current = currentTrackRef.current;
    
    if (isShuffleMode) {
      const nextTrack = getRandomTrack();
      if (nextTrack) {
        shuffleHistoryRef.current.push(nextTrack.id);
        selectTrack(nextTrack);
      }
    } else {
      // Linear mode - circular through all tracks
      if (!current) {
        selectTrack(allTracks[0]);
        return;
      }
      const currentIndex = allTracks.findIndex((t) => t.id === current.id);
      const nextIndex = (currentIndex + 1) % allTracks.length;
      selectTrack(allTracks[nextIndex]);
    }
  }, [selectTrack, getRandomTrack]);

  const playPrevious = useCallback(() => {
    const isShuffleMode = shuffleModeRef.current;
    const current = currentTrackRef.current;
    
    if (isShuffleMode) {
      // In shuffle mode, go back in history
      if (shuffleHistoryRef.current.length > 1) {
        shuffleHistoryRef.current.pop(); // Remove current
        const prevId = shuffleHistoryRef.current[shuffleHistoryRef.current.length - 1];
        const prevTrack = allTracks.find((t) => t.id === prevId);
        if (prevTrack) {
          selectTrack(prevTrack);
          return;
        }
      }
    }
    
    // Linear mode or no history - circular through all tracks
    if (!current) {
      selectTrack(allTracks[allTracks.length - 1]);
      return;
    }
    const currentIndex = allTracks.findIndex((t) => t.id === current.id);
    const prevIndex = currentIndex === 0 ? allTracks.length - 1 : currentIndex - 1;
    selectTrack(allTracks[prevIndex]);
  }, [selectTrack]);

  const toggleShuffleMode = useCallback(() => {
    setShuffleMode((prev) => !prev);
    shuffleHistoryRef.current = currentTrackRef.current ? [currentTrackRef.current.id] : [];
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        shuffleMode,
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
        toggleShuffleMode,
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
