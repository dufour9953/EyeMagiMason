"use client";

import { useEffect, useState } from "react";
import { useUI } from "../contexts/UIContext";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export function ArchiveModal() {
  const { isArchiveModalOpen, closeArchiveModal } = useUI();
  const [archivedDrops, setArchivedDrops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isArchiveModalOpen) {
      const fetchArchive = async () => {
        setIsLoading(true);
        // Assuming archived items have status 'ENDED'
        const { data } = await supabase
          .from("drops")
          .select("id, title, wood_type, image_url, created_at")
          .eq("status", "ENDED")
          .order("created_at", { ascending: false });
          
        if (data) {
          setArchivedDrops(data);
        }
        setIsLoading(false);
      };
      
      fetchArchive();
    }
  }, [isArchiveModalOpen]);

  if (!isArchiveModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm transition-opacity"
        onClick={closeArchiveModal}
      ></div>
      
      {/* Modal */}
      <div className="glass-panel relative z-10 w-full max-w-4xl p-8 rounded-2xl border border-primary/20 shadow-2xl flex flex-col text-left animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-start justify-between mb-8">
           <div>
            <h3 className="text-3xl font-black text-slate-100 mb-2 font-display uppercase tracking-tighter">The Vault</h3>
            <p className="text-primary font-bold tracking-widest uppercase text-xs">Past Auctions & Legacy Flutes</p>
           </div>
           <button onClick={closeArchiveModal} className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-slate-800 border-none transition-colors">
              <span className="material-symbols-outlined text-lg">close</span>
           </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
            </span>
          </div>
        ) : archivedDrops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {archivedDrops.map((drop) => (
              <div key={drop.id} className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-dark border border-white/5 flex items-center justify-center shadow-lg transition-transform hover:scale-[1.02] cursor-pointer" title="View historical drop data (Coming soon)">
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/20 to-transparent z-10"></div>
                <img 
                  alt={drop.title}
                  className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                  src={drop.image_url}
                />
                <div className="absolute bottom-6 left-6 z-20 right-6">
                  <p className="text-primary font-bold uppercase tracking-widest text-[10px] mb-1">{drop.wood_type}</p>
                  <h4 className="text-xl font-bold text-slate-100 truncate">{drop.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Sold {new Date(drop.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-moss-muted/10 border border-moss-border rounded-xl">
             <span className="material-symbols-outlined text-4xl text-slate-600 mb-4 block">inventory_2</span>
             <p className="text-slate-400 font-medium">The vault is currently empty.</p>
             <p className="text-sm text-slate-500 mt-2">Past auctions will be archived here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
