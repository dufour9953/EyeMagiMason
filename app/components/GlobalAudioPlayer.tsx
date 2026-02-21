"use client";

import { useState, useEffect } from "react";
import { useAudio } from "../contexts/AudioContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function GlobalAudioPlayer() {
  const { isPlaying, progress, duration, togglePlay, formatTime, currentTrack, stop } = useAudio();
  const [isVisible, setIsVisible] = useState(true);
  const [isDocked, setIsDocked] = useState(true); // Default to docked to bottom of screen
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const isAdminPadded = pathname?.startsWith("/admin");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-show player if a track starts playing and it was closed
  useEffect(() => {
    if (isPlaying) {
      setIsVisible(true);
    }
  }, [isPlaying]);

  if (!isClient) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && isDocked && (
        <motion.div
          key="docked-player"
          layout="position"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed bottom-0 left-0 w-full z-[100] glass-panel border-t p-4 flex items-center justify-between gap-4 transition-colors duration-500
            ${isPlaying ? 'border-primary/40 shadow-[0_-10px_30px_rgba(238,173,43,0.1)]' : 'border-white/10 opacity-95'}
          `}
        >
          {isPlaying && <div className="absolute inset-0 amber-glow-radial opacity-30 mix-blend-screen pointer-events-none"></div>}
          
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 md:gap-8 relative z-10">
            {/* Left Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={togglePlay}
                className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-background-dark hover:scale-110 transition-all duration-300 ${isPlaying ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-primary'}`}
              >
                <span className="material-symbols-outlined fill-1" style={{ fontSize: '24px' }}>{isPlaying ? 'pause' : 'play_arrow'}</span>
              </button>
              
              {/* Expansive Track Info with Layout transition */}
              <AnimatePresence>
                {isPlaying && currentTrack?.coverArt && (
                  <motion.img 
                    initial={{ opacity: 0, width: 0, scale: 0.8 }}
                    animate={{ opacity: 1, width: 48, scale: 1 }}
                    exit={{ opacity: 0, width: 0, scale: 0.8 }}
                    layout
                    src={currentTrack.coverArt} 
                    alt="Cover Art" 
                    className="h-12 w-12 rounded object-cover border border-white/10 hidden sm:block shadow-lg"
                  />
                )}
              </AnimatePresence>
              <div className="hidden sm:block min-w-32 max-w-48">
                <p className={`text-sm font-bold leading-none mb-1 truncate transition-colors ${isPlaying ? 'text-primary' : 'text-slate-100'}`}>
                  {currentTrack?.title || "Track"}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-primary/80 truncate">
                  {currentTrack?.subtitle || "Artist"}
                </p>
              </div>
            </div>

            {/* Center Progress */}
            <div className="flex-grow flex items-center gap-3 max-w-2xl px-4">
              <span className="text-[10px] font-mono text-slate-500 w-8 text-right hidden sm:block">{formatTime(progress)}</span>
              <div className={`flex-grow h-1.5 rounded-full relative overflow-hidden transition-colors ${isPlaying ? 'bg-primary/20' : 'bg-white/10'}`}>
                <div 
                  className={`absolute inset-y-0 left-0 ${isPlaying ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-primary'} rounded-full transition-all duration-100`}
                  style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 w-8 hidden sm:block">{formatTime(duration)}</span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsDocked(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/5 rounded-full transition-colors"
                title="Float Player"
              >
                <span className="material-symbols-outlined">pip</span>
              </button>
              <button 
                onClick={() => {
                  stop();
                  setIsVisible(false);
                }}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/10 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {isVisible && !isDocked && (
        <motion.div 
          key="floating-player"
          drag
          dragConstraints={
            typeof window !== 'undefined' 
            ? { top: -window.innerHeight + 150, left: -window.innerWidth + 320, right: 0, bottom: 0 }
            : undefined
          }
          dragElastic={0.1}
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed z-[90] bottom-10 right-10 w-[340px] glass-panel border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 select-none touch-none
            ${isPlaying ? 'border-primary/40 drop-shadow-[0_0_20px_rgba(238,173,43,0.25)]' : 'opacity-80 hover:opacity-100'}
          `}
        >
          {isPlaying && <div className="absolute inset-0 amber-glow-radial opacity-20 mix-blend-screen pointer-events-none rounded-2xl"></div>}
          
          <div className="flex items-center gap-3 relative z-10 w-full pointer-events-none">
            {/* Play Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              onPointerDown={(e) => e.stopPropagation()}
              className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-background-dark hover:scale-110 transition-all duration-300 pointer-events-auto cursor-pointer ${isPlaying ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 'bg-primary'}`}
            >
              <span className="material-symbols-outlined fill-1" style={{ fontSize: '24px' }}>{isPlaying ? 'pause' : 'play_arrow'}</span>
            </button>
            
            {/* Track Info */}
            <div className="flex-grow min-w-0 pointer-events-auto px-1">
              <p className={`text-sm font-bold leading-none mb-1.5 truncate transition-colors ${isPlaying ? 'text-primary' : 'text-slate-100'}`}>
                {currentTrack?.title || "Track"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-primary/80 truncate">
                {currentTrack?.subtitle || "Artist"}
              </p>
            </div>

            {/* Right integrated controls */}
            <div className="flex items-center pointer-events-auto bg-black/40 rounded-full p-1 border border-white/5 backdrop-blur-md">
              <button 
                onClick={() => setIsDocked(true)}
                onPointerDown={(e) => e.stopPropagation()}
                title="Dock to bottom"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">dock_to_bottom</span>
              </button>
              <button 
                onClick={() => {
                  stop();
                  setIsVisible(false);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                title="Close Player"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
              <div 
                title="Drag to move"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white cursor-grab active:cursor-grabbing transition-colors"
                onPointerDown={(e) => {
                   // Let Framer Motion handle drag propagation automatically
                }}
              >
                <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 relative z-10 w-full px-1">
            <span className="text-[10px] font-mono text-slate-500 w-8 text-right">{formatTime(progress)}</span>
            <div className={`flex-grow h-1.5 rounded-full relative overflow-hidden transition-colors duration-500 ${isPlaying ? 'bg-primary/20' : 'bg-white/10'}`}>
              <div 
                className={`absolute inset-y-0 left-0 ${isPlaying ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-primary'} rounded-full transition-all`}
                style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 w-8">{formatTime(duration)}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
