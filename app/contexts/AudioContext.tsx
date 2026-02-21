"use client";

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react";

interface AudioContextType {
  isPlaying: boolean;
  progress: number;
  duration: number;
  togglePlay: () => void;
  formatTime: (time: number) => string;
  setAudioSource: (src: string, title: string, subtitle: string) => void;
  currentTrack: { title: string; subtitle: string } | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<{ title: string; subtitle: string } | null>({
    title: "The Cedar Solace",
    subtitle: "Original Composition by Mason"
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element on client side to avoid hydration mismatch
    audioRef.current = new window.Audio("/straight-offtheblock.m4a");
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = ""; // Clean up memory
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Prevent uncaught play() promise rejections
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const setAudioSource = (src: string, title: string, subtitle: string) => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = src;
      setCurrentTrack({ title, subtitle });
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.error(e));
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AudioContext.Provider value={{ isPlaying, progress, duration, togglePlay, formatTime, setAudioSource, currentTrack }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
