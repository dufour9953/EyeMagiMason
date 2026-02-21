"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useUI } from "../contexts/UIContext";
import { useAudio } from "../contexts/AudioContext";
import { motion } from "framer-motion";
import { Navigation } from "../components/Navigation";

export default function DropPage() {
  const DROP_ID = "11111111-1111-1111-1111-111111111111"; // Seeding from the MVP database slot
  const [drop, setDrop] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidInput, setBidInput] = useState("");
  const [pulseCSS, setPulseCSS] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [timerLabel, setTimerLabel] = useState("Loading...");
  
  const { openPreviewModal, openArchiveModal, openAboutModal } = useUI();
  const { isPlaying } = useAudio();

  useEffect(() => {
    if (!drop) return;
    
    const calculateTime = () => {
      const now = new Date().getTime();
      const startTime = drop.start_time ? new Date(drop.start_time).getTime() : 0;
      const endTime = drop.end_time ? new Date(drop.end_time).getTime() : 0;
      
      let targetTime = 0;
      if (startTime > now) {
        targetTime = startTime;
        setTimerLabel("Auction Starts In");
      } else if (endTime > now) {
        targetTime = endTime;
        setTimerLabel("Auction Ends In");
      } else if (endTime > 0 && endTime <= now) {
        targetTime = 0;
        setTimerLabel("Auction Concluded");
      } else {
        setTimerLabel("Auction is Live");
        return null;
      }
      return targetTime;
    };

    let timer: NodeJS.Timeout;
    let target = calculateTime();
    
    if (target) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = target! - now;
        
        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
          target = calculateTime();
        } else {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff / 1000 / 60) % 60);
          const s = Math.floor((diff / 1000) % 60);
          setTimeLeft({
            hours: h.toString().padStart(2, '0'),
            minutes: m.toString().padStart(2, '0'),
            seconds: s.toString().padStart(2, '0')
          });
        }
      }, 1000);
    } else {
      setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
    }

    return () => clearInterval(timer);
  }, [drop]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: dData } = await supabase.from('drops').select('*').eq('id', DROP_ID).single();
      if (dData) setDrop(dData);
      
      const { data: bData } = await supabase.from('bids').select('*').eq('drop_id', DROP_ID).order('amount', { ascending: false });
      if (bData) setBids(bData);

      setLoading(false);
    }
    
    fetchInitialData();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids', filter: `drop_id=eq.${DROP_ID}` }, (payload) => {
        setBids((current) => {
          const newBids = [payload.new, ...current];
          return newBids.sort((a,b) => b.amount - a.amount);
        });
        // Trigger a visual pulse when a new bid arrives over WebSockets
        setPulseCSS(true);
        setTimeout(() => setPulseCSS(false), 1000);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, []);

  const handleBidSubmit = async () => {
    if (!bidInput || isNaN(Number(bidInput))) return;
    const amount = Number(bidInput);
    
    const currentHigh = bids.length > 0 ? bids[0].amount : (drop?.starting_bid || 0);
    if (amount <= currentHigh) {
      alert("Bid must be higher than current highest bid.");
      return;
    }
    
    // Insert new bid
    await supabase.from("bids").insert([{
      drop_id: DROP_ID,
      bidder_name: "Anonymous_Collector_" + Math.floor(Math.random() * 100), 
      bidder_email: "anon@example.com",
      amount: amount,
      status: "VALID"
    }]);
    
    setBidInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark text-primary">
         <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
        </span>
      </div>
    );
  }

  const highestBid = bids.length > 0 ? bids[0].amount : (drop?.starting_bid || 0);
  const highestBidder = bids.length > 0 ? bids[0].bidder_name : "No bids yet";

  return (
    <div className={`min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 relative transition-colors duration-1000 ${isPlaying ? 'bg-[#1a140b] dark:bg-[#1a140b]' : ''}`}>
      {/* Top Navigation */}
      <Navigation />
      
      <motion.main 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 relative pb-32"
      >
        {/* Left: Gallery & Details */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="relative group">
            <div className={`absolute inset-0 amber-glow-radial scale-150 pointer-events-none transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}></div>
            <div className={`relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-dark border border-primary/5 flex items-center justify-center shadow-2xl transition-all duration-1000 ${isPlaying ? 'shadow-[0_0_40px_rgba(238,173,43,0.15)]' : ''}`}>
              <img 
                alt="Handcrafted cedar flute on a stone pedestal" 
                className="w-full h-full object-cover mix-blend-lighten opacity-90" 
                src={drop?.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD2jmxtHoyD_QwAGqat9Ci3B7KGBnKzEkKr2H_jFFiRd_wFPLSfd9sqTlDt5CGskLCwQcYiGjJN0xG4t6e7T0qrbTrgb-Hh42Q24zucbUoyLZLb3G3I7J0jBLP9brLRtkRnKNzY43ypwvnVj0j9WZm7xxZWiQz6tnb1Kxp4eMwRM_cU0Bs4c66yfyqSqKDwsIUorkh3ERodE-dUNZdh9b34Xkli19CZ0pAd6TbD6orZDS75AXv54Fz1z386IDeOpICTVGEhmo12Kvc"}
              />
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
          
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-black text-slate-100 mb-2">{drop?.title || "The Cedar Solace"}</h2>
              <p className="text-lg text-slate-400 italic">"A vessel for the breath of the ancient forest."</p>
            </div>
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Wood Type</p>
                <p className="font-semibold">{drop?.wood_type || "Western Red Cedar"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Tuning</p>
                <p className="font-semibold">{drop?.tuning_key || "432Hz (A4)"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Length</p>
                <p className="font-semibold">18 Inches</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Artist's Notes</h3>
              <p className="text-slate-300 leading-relaxed max-w-2xl">
                {drop?.description || "Hand-carved over forty-eight hours of silence in the Olympic Peninsula. The grain of this specific cedar piece follows a spiral pattern, which lends a haunting, resonant quality to the lower registers. Finished only with organic walnut oil and mountain beeswax."}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right: Auction Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-xl border border-white/10 shadow-xl lg:sticky lg:top-28">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-bold">{timerLabel}</p>
              <div className="flex gap-4">
                <div className="flex-1 bg-white/5 rounded-lg p-4 text-center border border-white/5">
                  <p className="text-3xl font-black text-slate-100">{timeLeft.hours}</p>
                  <p className="text-[10px] uppercase tracking-tighter text-slate-500">Hours</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-4 text-center border border-white/5">
                  <p className="text-3xl font-black text-slate-100">{timeLeft.minutes}</p>
                  <p className="text-[10px] uppercase tracking-tighter text-slate-500">Minutes</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-4 text-center border border-white/5">
                  <p className="text-3xl font-black text-slate-100">{timeLeft.seconds}</p>
                  <p className="text-[10px] uppercase tracking-tighter text-slate-500">Seconds</p>
                </div>
              </div>
            </div>
            
            <div className={`mb-8 p-6 bg-primary/5 rounded-xl border border-primary/20 transition-all duration-300 ${pulseCSS ? 'scale-[1.02] shadow-[0_0_20px_rgba(238,173,43,0.4)]' : ''}`}>
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs uppercase tracking-widest text-primary font-bold">Current Bid</p>
                <p className="text-xs text-slate-500">Highest Bidder: <span className="text-slate-300">@{highestBidder.split('@')[0]}</span></p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-primary">{highestBid.toFixed(2)}</span>
                <span className="text-xl font-bold text-primary/70">ETH</span>
              </div>
              <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                Live updating
              </p>
            </div>
            
            <div className="space-y-4">
              {drop?.status === 'ENDED' ? (
                <div className="text-center p-6 border border-white/10 rounded-xl bg-black/40">
                  <p className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest text-primary">Auction Concluded</p>
                  <p className="text-xs text-slate-400 mb-6">Winning Bid: <span className="text-slate-200 font-bold">{highestBid.toFixed(2)} ETH</span></p>
                  <button disabled className="w-full bg-slate-800 text-slate-500 font-black py-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed border border-slate-700">
                    <span className="material-symbols-outlined">lock</span>
                    Checkout Locked (Pending Stripe Setup)
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">ETH</span>
                    <input 
                      value={bidInput}
                      onChange={(e) => setBidInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-14 pr-4 text-slate-100 focus:outline-none focus:border-primary/50 transition-colors" 
                      placeholder={`${(highestBid + 0.5).toFixed(2)} or higher`} 
                      type="number" 
                    />
                  </div>
                  <button 
                    onClick={handleBidSubmit}
                    className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black py-4 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    Place Your Bid
                    <span className="material-symbols-outlined">gavel</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest">Reserve price has been met</p>
                </>
              )}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-bold">Recent History</p>
              <div className="space-y-3 h-32 overflow-y-auto pr-2 custom-scrollbar">
                {bids.slice(0, 10).map((b, idx) => (
                  <div key={b.id || idx} className="flex justify-between text-xs p-2 rounded hover:bg-white/5 transition-colors">
                    <span className="text-slate-400">Bid by @{b.bidder_name}</span>
                    <span className="text-slate-200">{b.amount.toFixed(2)} ETH</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.main>
      
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-900/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}
