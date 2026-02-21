"use client";

import { useUI } from "../contexts/UIContext";
import { useAudio } from "../contexts/AudioContext";
import { useState } from "react";
import Link from "next/link";
// Removing Header & Footer and GlobalAudioPlayer since they are either handled globally or inline

// Mock data for the audio library until Supabase is fully wired
const libraryTracks = [
  {
    id: "1",
    title: "The Cedar Solace",
    duration: "15:00",
    plays: "1.2k",
    woodType: "Western Red Cedar",
    tuning: "432Hz (A4)",
    coverArt: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_732d84db8e.mp3?filename=flute-ambient-126274.mp3"
  },
  {
    id: "2",
    title: "Midnight Embers",
    duration: "12:30",
    plays: "842",
    woodType: "Walnut Burl",
    tuning: "440Hz (E4)",
    coverArt: "https://images.unsplash.com/photo-1517769534661-f3b76251c6cc?q=80&w=2000&auto=format&fit=crop",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc862f9ff4.mp3?filename=native-american-flute-11440.mp3"
  },
  {
    id: "3",
    title: "Dawn Chorus",
    duration: "08:45",
    plays: "2.1k",
    woodType: "Cherry Wood",
    tuning: "432Hz (G4)",
    coverArt: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_732d84db8e.mp3?filename=flute-ambient-126274.mp3" // Reusing for mock
  }
];

export default function ListenPage() {
  const { openPreviewModal } = useUI();
  const { togglePlay, isPlaying, setAudioSource, currentTrack } = useAudio();
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const handlePlayClick = (track: any) => {
    // If it's the currently playing track, just toggle pause/play
    if (currentTrack && currentTrack.title === track.title) {
      togglePlay();
    } else {
      // Switch the whole global context to this track and ensure playing state
      setAudioSource(track.audioSrc, track.title, `${track.woodType} • ${track.tuning}`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 relative transition-colors duration-1000 ${isPlaying ? 'bg-[#1a140b] dark:bg-[#1a140b]' : ''}`}>
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">fluid</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">iMagiMason</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/">Home</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/drop">Live Auction</Link>
            <Link className="text-sm font-medium text-primary border-b-2 border-primary pb-1 transition-colors" href="/listen">Listen</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => openPreviewModal("Wallet Connection")} className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark font-bold text-sm rounded-lg hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              Connect Wallet
            </button>
            <button className="md:hidden text-slate-100">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-12 flex flex-col gap-16 relative z-10">
        
        {/* Page Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
              The Collection
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
              Explore the sonic landscape of iMagiMason. Each piece is an original composition recorded directly from the flutes crafted in the workshop.
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0">
            <Link href="/" className="px-6 py-3 border border-moss-border text-slate-300 font-bold rounded-lg hover:bg-white/5 transition-colors uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">home</span>
              Home
            </Link>
          </div>
        </section>

        {/* Featured Track / Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-moss-border bg-moss-muted/20 group">
          <div className="absolute inset-0">
             <img 
               src={libraryTracks[0].coverArt} 
               alt="Featured Track"
               className="w-full h-full object-cover opacity-30 transform group-hover:scale-105 transition-transform duration-700 ease-out"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-[#0a0f0a]/80 to-transparent" />
          </div>
          
          <div className="relative p-8 md:p-16 flex flex-col md:flex-row gap-8 items-end justify-between h-full min-h-[400px]">
             <div className="space-y-4">
               <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                 Featured Composition
               </span>
               <h2 className="text-3xl md:text-5xl font-black">{libraryTracks[0].title}</h2>
               <div className="flex items-center gap-4 text-sm text-slate-300">
                 <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">graphic_eq</span>{libraryTracks[0].tuning}</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                 <span>{libraryTracks[0].woodType}</span>
               </div>
             </div>
             
             <button 
               onClick={() => handlePlayClick(libraryTracks[0])}
               className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-primary text-background-dark rounded-full flex items-center justify-center hover:scale-105 transition-transform drop-shadow-[0_0_20px_rgba(238,173,43,0.3)] group-hover:drop-shadow-[0_0_30px_rgba(238,173,43,0.5)]"
             >
               <span className="material-symbols-outlined text-4xl ml-1">
                 {isPlaying && currentTrack?.title === libraryTracks[0].title ? 'pause' : 'play_arrow'}
               </span>
             </button>
          </div>
        </section>

        {/* Tracklist Table */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">All Tracks</h3>
            <span className="text-sm text-slate-400 font-medium">{libraryTracks.length} compositions</span>
          </div>
          
          <div className="rounded-2xl border border-moss-border overflow-hidden bg-[#121a12]/50 backdrop-blur-sm">
            <table className="w-full text-left">
              <thead className="bg-moss-muted/30 text-xs uppercase tracking-widest text-slate-500 border-b border-moss-border">
                <tr>
                  <th className="w-16 px-6 py-4">#</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 hidden md:table-cell">Wood / Tuning</th>
                  <th className="px-6 py-4 hidden sm:table-cell text-right">Plays</th>
                  <th className="px-6 py-4 text-right">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-moss-border/50">
                {libraryTracks.map((track, index) => {
                  const isCurrentTrack = currentTrack?.title === track.title;
                  const isHovered = hoveredTrack === track.id;
                  
                  return (
                    <tr 
                      key={track.id}
                      onMouseEnter={() => setHoveredTrack(track.id)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      onClick={() => handlePlayClick(track)}
                      className={`group hover:bg-white/5 transition-colors cursor-pointer ${isCurrentTrack ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-6 py-4 w-16 text-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full transition-colors group-hover:bg-primary/20">
                          {isCurrentTrack && isPlaying ? (
                            <span className="material-symbols-outlined text-primary text-[20px] animate-pulse">equalizer</span>
                          ) : isHovered ? (
                            <span className="material-symbols-outlined text-slate-300 text-[20px] ml-0.5">play_arrow</span>
                          ) : (
                            <span className={`text-sm font-medium ${isCurrentTrack ? 'text-primary font-bold' : 'text-slate-500'}`}>{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={track.coverArt} 
                            alt={track.title}
                            className="w-12 h-12 rounded opacity-80 group-hover:opacity-100 transition-opacity object-cover"
                          />
                          <p className={`font-bold ${isCurrentTrack ? 'text-primary' : 'text-slate-200 group-hover:text-white transition-colors'}`}>
                            {track.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-slate-400">
                        <span className="truncate block max-w-[200px] text-sm">{track.woodType}</span>
                        <span className="text-xs text-slate-500 mt-0.5 block">{track.tuning}</span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-slate-400 font-mono text-sm text-right">
                        {track.plays}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-sm text-right">
                        {track.duration}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
