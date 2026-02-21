"use client";

import { useUI } from "../contexts/UIContext";

export function PreviewModal() {
  const { isPreviewModalOpen, previewFeatureName, closePreviewModal } = useUI();

  if (!isPreviewModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm transition-opacity"
        onClick={closePreviewModal}
      ></div>
      
      {/* Modal */}
      <div className="glass-panel relative z-10 w-full max-w-md p-8 rounded-2xl border border-primary/20 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/30">
          <span className="material-symbols-outlined text-3xl text-primary">construction</span>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-100 mb-2 font-display">In Development</h3>
        <p className="text-primary font-medium tracking-widest uppercase text-xs mb-6">"{previewFeatureName}"</p>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          The iMagiMason digital ecosystem is currently in its Preview phase. This feature is being actively crafted and will be available in a future update.
        </p>
        
        <button 
          onClick={closePreviewModal}
          className="w-full py-3 bg-primary text-background-dark font-bold rounded-lg hover:brightness-110 transition-all shadow-[0_0_15px_rgba(238,173,43,0.3)]"
        >
          Return to Portal
        </button>
      </div>
    </div>
  );
}
