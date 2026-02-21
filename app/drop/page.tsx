import Link from "next/link";

export default function DropPage() {
  return (
    <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 relative">
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
            <Link className="text-sm font-medium hover:text-primary transition-colors text-primary border-b-2 border-primary pb-1" href="/drop">Live Auction</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/">Archive</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/#story">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark font-bold text-sm rounded-lg hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              Connect Wallet
            </button>
            <button className="md:hidden text-slate-100">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 relative pb-32">
        {/* Left: Gallery & Details */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute inset-0 amber-glow-radial scale-150 pointer-events-none"></div>
            {/* Main Flute Image */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-dark border border-primary/5 flex items-center justify-center shadow-2xl">
              <img 
                alt="Handcrafted cedar flute on a stone pedestal" 
                className="w-full h-full object-cover mix-blend-lighten opacity-90" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2jmxtHoyD_QwAGqat9Ci3B7KGBnKzEkKr2H_jFFiRd_wFPLSfd9sqTlDt5CGskLCwQcYiGjJN0xG4t6e7T0qrbTrgb-Hh42Q24zucbUoyLZLb3G3I7J0jBLP9brLRtkRnKNzY43ypwvnVj0j9WZm7xxZWiQz6tnb1Kxp4eMwRM_cU0Bs4c66yfyqSqKDwsIUorkh3ERodE-dUNZdh9b34Xkli19CZ0pAd6TbD6orZDS75AXv54Fz1z386IDeOpICTVGEhmo12Kvc"
              />
              {/* Live Badge */}
              <div className="absolute top-6 left-6">
                <div className="flex items-center gap-2 bg-background-dark/60 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-bold tracking-widest uppercase text-primary">This moment is live • 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-black text-slate-100 mb-2">The Cedar Solace</h2>
              <p className="text-lg text-slate-400 italic">"A vessel for the breath of the ancient forest."</p>
            </div>
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Wood Type</p>
                <p className="font-semibold">Western Red Cedar</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Tuning</p>
                <p className="font-semibold">432Hz (A4)</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Length</p>
                <p className="font-semibold">18 Inches</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Artist's Notes</h3>
              <p className="text-slate-300 leading-relaxed max-w-2xl">
                Hand-carved over forty-eight hours of silence in the Olympic Peninsula. The grain of this specific cedar piece follows a spiral pattern, which lends a haunting, resonant quality to the lower registers. Finished only with organic walnut oil and mountain beeswax.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right: Auction Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-xl border border-white/10 shadow-xl lg:sticky lg:top-28">
            {/* Countdown */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-bold">Auction Ends In</p>
              <div className="flex gap-4">
                <div className="flex-1 bg-white/5 rounded-lg p-4 text-center border border-white/5">
                  <p className="text-3xl font-black text-slate-100">02</p>
                  <p className="text-[10px] uppercase tracking-tighter text-slate-500">Hours</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-4 text-center border border-white/5">
                  <p className="text-3xl font-black text-slate-100">45</p>
                  <p className="text-[10px] uppercase tracking-tighter text-slate-500">Minutes</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-4 text-center border border-white/5">
                  <p className="text-3xl font-black text-slate-100">12</p>
                  <p className="text-[10px] uppercase tracking-tighter text-slate-500">Seconds</p>
                </div>
              </div>
            </div>
            
            {/* Current Bid */}
            <div className="mb-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs uppercase tracking-widest text-primary font-bold">Current Bid</p>
                <p className="text-xs text-slate-500">Highest Bidder: <span className="text-slate-300">@ethereal_collector</span></p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-primary">4.50</span>
                <span className="text-xl font-bold text-primary/70">ETH</span>
              </div>
              <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +0.25 ETH since last hour
              </p>
            </div>
            
            {/* Action Area */}
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">ETH</span>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-14 pr-4 text-slate-100 focus:outline-none focus:border-primary/50 transition-colors" placeholder="4.75 or higher" type="number" />
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-4 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                Place Your Bid
                <span className="material-symbols-outlined">gavel</span>
              </button>
              <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest">Reserve price has been met</p>
            </div>
            
            {/* Mini History */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-bold">Recent History</p>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Bid by @nature_soul</span>
                  <span className="text-slate-200">4.25 ETH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Bid by @woodwind_fan</span>
                  <span className="text-slate-200">4.00 ETH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Music Player Fixed Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] px-6 pb-6 mt-10">
        <div className="max-w-5xl mx-auto glass-panel border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 shrink-0 rounded-full bg-primary flex items-center justify-center text-background-dark hover:scale-105 transition-transform">
              <span className="material-symbols-outlined fill-1">play_arrow</span>
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-100 leading-none mb-1">The Cedar Solace</p>
              <p className="text-[10px] uppercase tracking-widest text-primary/80">Original Composition by Mason</p>
            </div>
          </div>
          <div className="flex-grow flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-500">0:45</span>
            <div className="flex-grow h-1.5 bg-white/10 rounded-full relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-primary rounded-full"></div>
            </div>
            <span className="text-[10px] font-mono text-slate-500">3:24</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">volume_up</span>
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">playlist_play</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-900/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}
