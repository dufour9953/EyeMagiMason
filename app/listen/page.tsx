"use client";

import { useUI } from "../contexts/UIContext";
import { useAudio } from "../contexts/AudioContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { Navigation } from "../components/Navigation";

export default function ListenPage() {
  const { openPreviewModal, openArchiveModal, openAboutModal } = useUI();
  const { togglePlay, isPlaying, setAudioSource, currentTrack, formatTime } = useAudio();
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [libraryTracks, setLibraryTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      const { data } = await supabase.from('audio_tracks').select('*').order('created_at', { ascending: false });
      if (data) setLibraryTracks(data);
      setLoading(false);
    };
    fetchTracks();
  }, []);

  const handlePlayClick = async (track: any) => {
    if (currentTrack && currentTrack.title === track.title) {
      togglePlay();
    } else {
      setAudioSource(track.audio_url, track.title, `${track.wood_type} • ${track.tuning}`, track.cover_art_url);
      
      const newPlays = (track.plays || 0) + 1;
      await supabase.from('audio_tracks').update({ plays: newPlays }).eq('id', track.id);
      
      setLibraryTracks(current => current.map(t => t.id === track.id ? { ...t, plays: newPlays } : t));
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 relative transition-colors duration-1000 ${isPlaying ? 'bg-[#1a140b] dark:bg-[#1a140b]' : ''}`}>
      
      {/* Top Navigation */}
      <Navigation />

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
        </section>

        {/* Featured Track / Hero */}
        {!loading && libraryTracks.length > 0 && (
          <section className="relative overflow-hidden rounded-3xl border border-moss-border bg-moss-muted/20 group">
            <div className="absolute inset-0">
               <img 
                 src={libraryTracks[0].cover_art_url} 
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
                   <span>{libraryTracks[0].wood_type}</span>
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
        )}

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
                            src={track.cover_art_url} 
                            alt={track.title}
                            className="w-12 h-12 rounded opacity-80 group-hover:opacity-100 transition-opacity object-cover"
                          />
                          <p className={`font-bold ${isCurrentTrack ? 'text-primary' : 'text-slate-200 group-hover:text-white transition-colors'}`}>
                            {track.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-slate-400">
                        <span className="truncate block max-w-[200px] text-sm">{track.wood_type}</span>
                        <span className="text-xs text-slate-500 mt-0.5 block">{track.tuning}</span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-slate-400 font-mono text-sm text-right">
                        {track.plays || 0}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-sm text-right">
                        {track.duration ? formatTime(Number(track.duration)) : "00:00"}
                      </td>
                    </tr>
                  );
                })}
                {libraryTracks.length === 0 && !loading && (
                   <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                       No tracks in library.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
