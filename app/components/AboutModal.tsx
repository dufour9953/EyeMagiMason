"use client";

import { useEffect, useState } from "react";
import { useUI } from "../contexts/UIContext";
import { supabase } from "../../lib/supabase";

export function AboutModal() {
  const { isAboutModalOpen, closeAboutModal } = useUI();
  const [aboutText, setAboutText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAboutModalOpen) {
      const fetchAbout = async () => {
        setIsLoading(true);
        const { data } = await supabase
          .from("site_content")
          .select("content")
          .eq("id", "about_text")
          .single();
          
        if (data) {
          setAboutText(data.content);
        } else {
          setAboutText("The story of iMagiMason is currently being carved.");
        }
        setIsLoading(false);
      };
      
      fetchAbout();
    }
  }, [isAboutModalOpen]);

  if (!isAboutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm transition-opacity"
        onClick={closeAboutModal}
      ></div>
      
      {/* Modal */}
      <div className="glass-panel relative z-10 w-full max-w-2xl p-10 rounded-2xl border border-primary/20 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border border-primary/30 shrink-0">
          <img 
            src="/mason_magi_portrait.png" 
            alt="Mason Izaguirre-Pyle" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        
        <h3 className="text-3xl font-black text-slate-100 mb-2 font-display uppercase tracking-tighter">Mason Izaguirre-Pyle</h3>
        <p className="text-primary font-bold tracking-widest uppercase text-xs mb-8">Eye Magi Mason</p>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
            </span>
          </div>
        ) : (
          <div className="text-slate-300 leading-relaxed text-left whitespace-pre-line text-lg font-light space-y-4 mb-10 w-full px-4">
            {aboutText}
          </div>
        )}
        
        <button 
          onClick={closeAboutModal}
          className="w-full sm:w-auto px-12 py-3 bg-primary/10 text-primary border border-primary/20 font-bold rounded-lg hover:bg-primary/20 uppercase tracking-widest text-sm transition-all mt-auto"
        >
          Return 
        </button>
      </div>
    </div>
  );
}
