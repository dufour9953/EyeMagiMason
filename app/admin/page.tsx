"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useUI } from "../contexts/UIContext";

export default function AdminDashboard() {
  const { openPreviewModal } = useUI();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Main Navigation State
  const [activeTab, setActiveTab] = useState("Overview");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // New Admin Data States
  const [stats, setStats] = useState({ highBid: 0, bidCount: 0 });
  const [allBids, setAllBids] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Story & Calendar Form States
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  // Storage Upload States
  const [fluteImage, setFluteImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchAdminData = async () => {
      // Fetch all bids
      const { data: bData } = await supabase.from('bids').select('*').order('created_at', { ascending: false });
      if (bData) {
        setAllBids(bData);
        const high = bData.length > 0 ? Math.max(...bData.map((b: any) => b.amount)) : 0;
        setStats({ highBid: high, bidCount: bData.length });
      }
      
      // Fetch stories
      const { data: sData } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
      if (sData) setStories(sData);

      // Fetch calendar events
      const { data: eData } = await supabase.from('calendar_events').select('*').order('date', { ascending: true });
      if (eData) setEvents(eData);
    };
    
    if (!loading) {
      fetchAdminData();
    }
  }, [loading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleLaunch = async () => {
    if (!title || !startingBid || !fluteImage || !audioFile) {
      alert("Please complete the form and upload both media files before launching.");
      return;
    }
    setIsPublishing(true);
    
    try {
      // 1. Upload files
      const imageUrl = await uploadFile(fluteImage, 'flute-images');
      const audioUrl = await uploadFile(audioFile, 'exclusive-audio');

      // 2. Insert Drop
      const { error } = await supabase.from('drops').insert([{
        title: title,
        flute_name: title,
        description: description,
        starting_bid: parseFloat(startingBid),
        status: 'LIVE',
        image_url: imageUrl,
        audio_url: audioUrl,
        wood_type: "Western Red Cedar",
        tuning_key: "432Hz (A4)"
      }]);

      if (error) throw error;
      
      alert("Auction Successfully Launched!");
      setTitle("");
      setDescription("");
      setStartingBid("");
      setFluteImage(null);
      setAudioFile(null);
      setActiveTab("Overview");
    } catch (err: any) {
      alert("Failed to launch drop: " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121a12] text-primary">
         <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#121a12] text-slate-100 font-display">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-moss-border bg-moss-muted/30 hidden lg:flex flex-col sticky top-0 h-screen">
        {/* Sidebar Header / Profile */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-moss-border shrink-0">
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight uppercase">iMagiMason</h1>
            <p className="text-xs text-slate-400">Artist Admin</p>
          </div>
          <button 
            onClick={handleLogout} 
            title="Log Out"
            className="w-8 h-8 rounded-full bg-moss-muted/50 text-slate-400 hover:text-red-400 hover:bg-red-400/10 flex items-center justify-center transition-colors border border-moss-border"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto pb-32 custom-scrollbar">
          <button onClick={() => setActiveTab('Overview')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'Overview' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`}>
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-sm font-medium">Overview</span>
          </button>
          <button onClick={() => setActiveTab('Manage Drops')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'Manage Drops' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`}>
            <span className="material-symbols-outlined text-[20px]">brush</span>
            <span className="text-sm font-medium">Manage Drops</span>
          </button>
          
          <div className="pt-4 pb-2 px-3">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Site Content</p>
          </div>
          
          <button onClick={() => setActiveTab('Site Content')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'Site Content' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`}>
            <span className="material-symbols-outlined text-[20px]">web</span>
            <span className="text-sm font-medium">Global Copy</span>
          </button>
          
          <button onClick={() => setActiveTab('Story Editor')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'Story Editor' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`}>
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            <span className="text-sm font-medium">Story Editor</span>
          </button>
          <button onClick={() => setActiveTab('Calendar')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'Calendar' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`}>
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span className="text-sm font-medium">Calendar</span>
          </button>
          <button onClick={() => setActiveTab('Bids & Results')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'Bids & Results' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`}>
            <span className="material-symbols-outlined text-[20px]">gavel</span>
            <span className="text-sm font-medium">Bids &amp; Results</span>
          </button>
          
          <div className="pt-4 pb-2 px-3">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Media Library</p>
          </div>
          
          <button onClick={() => setActiveTab('Audio Lab')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === 'Audio Lab' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`}>
            <span className="material-symbols-outlined text-[20px]">library_music</span>
            <span className="text-sm font-medium">Audio Lab</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-moss-border px-8 shrink-0 flex items-center justify-between sticky top-0 bg-[#121a12]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">{activeTab}</h2>
            {activeTab === 'Manage Drops' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-moss-muted text-slate-400 uppercase tracking-widest border border-moss-border">Drafting</span>}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/drop" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">Preview Storefront</Link>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full space-y-8 custom-scrollbar pb-32">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'Overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-moss-muted/50 border border-moss-border p-6 rounded-xl flex flex-col gap-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bids Engine</p>
                  <p className="text-2xl font-bold">{stats.bidCount}</p>
                </div>
                <div className="bg-moss-muted/50 border border-moss-border p-6 rounded-xl flex flex-col gap-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active High Bid</p>
                  <p className="text-2xl font-bold text-primary">${stats.highBid.toLocaleString()}</p>
                </div>
                <div className="bg-moss-muted/50 border border-moss-border p-6 rounded-xl flex flex-col gap-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Drops Crafted</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>

              {/* Recent Bids Mini View */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Latest Auction Activity
                </h3>
                  <div className="overflow-hidden border border-moss-border rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-moss-muted text-slate-400 font-medium border-b border-moss-border">
                      <tr>
                        <th className="px-6 py-3">Collector Name</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-moss-border">
                      {allBids.slice(0, 5).map((bid) => (
                        <tr key={bid.id} className="bg-moss-muted/10 hover:bg-moss-muted/20 transition-colors">
                          <td className="px-6 py-4 font-medium">{bid.bidder_name}</td>
                          <td className="px-6 py-4 font-bold text-primary">${bid.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-slate-500 text-right">{new Date(bid.created_at).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                      {allBids.length === 0 && (
                        <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No active bids yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* MANAGE DROPS TAB (Original Form) */}
          {activeTab === 'Manage Drops' && (
            <div className="bg-moss-muted/20 border border-moss-border rounded-xl overflow-hidden">
              <div className="border-b border-moss-border flex gap-8 px-8">
                <button className="py-4 border-b-2 border-primary text-sm font-bold text-slate-100">Flute &amp; Details</button>
              </div>
              
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Form Inputs */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Flute Title</label>
                    <input 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-moss-muted border border-moss-border rounded-lg focus:ring-primary text-slate-100 px-4 py-2.5 outline-none" 
                      placeholder="e.g. The Cedar Whisperer" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Artist Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-moss-muted border border-moss-border rounded-lg focus:ring-primary text-slate-100 px-4 py-2.5 outline-none custom-scrollbar" 
                      placeholder="Tell the story of the wood, the carve, and the spirit..." 
                      rows={5}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Starting Bid (USD)</label>
                    <input 
                      value={startingBid}
                      onChange={(e) => setStartingBid(e.target.value)}
                      className="w-full bg-moss-muted border border-moss-border rounded-lg focus:ring-primary text-slate-100 px-4 py-2.5 outline-none" 
                      placeholder="500.00" 
                      type="number" 
                    />
                  </div>
                </div>

                {/* Right: Media Uploads */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Flute Image (Required)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setFluteImage(e.target.files?.[0] || null)}
                      className="w-full bg-moss-muted/30 border border-dashed border-moss-border text-slate-400 p-4 rounded-xl cursor-pointer"
                    />
                    {fluteImage && <p className="text-xs text-primary font-bold">Queued: {fluteImage.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Exclusive Audio Release (Required MP4/WAV)</label>
                    <input 
                      type="file" 
                      accept="audio/*,video/mp4"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      className="w-full bg-moss-muted/30 border border-dashed border-moss-border text-slate-400 p-4 rounded-xl cursor-pointer"
                    />
                    {audioFile && <p className="text-xs text-primary font-bold">Queued: {audioFile.name}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS AS PLACEHOLDERS FOR NOW BUT FULLY ROUTED */}
          {activeTab === 'Story Editor' && (
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-xl font-bold mb-1">Story Content Editor</h3>
                   <p className="text-slate-400 text-sm">Write and catalog your studio stories. Auto-saves as a draft.</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 text-xs text-slate-500 font-medium px-3 py-1.5 bg-moss-muted/30 rounded-full border border-moss-border">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                     </span>
                     Auto-saved just now
                   </div>
                   <button className="px-6 py-2 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 text-sm uppercase tracking-wider transition-opacity">
                     Publish Story
                   </button>
                 </div>
               </div>

               <div className="bg-moss-muted/10 border border-moss-border rounded-xl overflow-hidden flex flex-col">
                 <input 
                   className="w-full bg-transparent border-b border-moss-border text-slate-100 text-2xl font-black px-8 py-6 outline-none placeholder:text-slate-600" 
                   placeholder="Story Headline (e.g., The Grain of the Walnut)..." 
                 />
                 
                 {/* Fake Rich Text Toolbar */}
                 <div className="bg-moss-muted/30 border-b border-moss-border px-6 py-3 flex items-center gap-2">
                   <button className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                   <button className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                   <button className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">format_underlined</span></button>
                   <div className="w-px h-4 bg-moss-border mx-2"></div>
                   <button className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                   <button className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">link</span></button>
                   <button className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">image</span></button>
                 </div>

                 <textarea 
                   className="w-full bg-transparent text-slate-300 px-8 py-6 outline-none min-h-[400px] leading-relaxed resize-none placeholder:text-slate-600" 
                   placeholder="Begin weaving the tale here. What inspired this piece? What happened in the woods?"
                 ></textarea>
               </div>
             </div>
          )}

          {activeTab === 'Calendar' && (
             <div className="bg-moss-muted/20 border border-moss-border p-8 rounded-xl min-h-[400px]">
               <h3 className="text-xl font-bold mb-4">Editorial & Event Calendar</h3>
               <div className="flex gap-4 mb-4">
                 <input className="flex-1 bg-moss-muted border border-moss-border rounded-lg px-4 py-2 text-slate-100" placeholder="Event Name" />
                 <input type="date" className="bg-moss-muted border border-moss-border rounded-lg px-4 py-2 text-slate-100" />
               </div>
               <button className="px-6 py-2 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90">Schedule Event</button>
             </div>
          )}
          
          {activeTab === 'Bids & Results' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">Global Bid Ledger</h3>
              <div className="overflow-hidden border border-moss-border rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-moss-muted text-slate-400 font-medium border-b border-moss-border">
                    <tr>
                      <th className="px-6 py-3">Collector Name</th>
                      <th className="px-6 py-3">Amount (USD)</th>
                      <th className="px-6 py-3">Bidder Contact</th>
                      <th className="px-6 py-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-moss-border">
                    {allBids.map((bid) => (
                      <tr key={bid.id} className="bg-moss-muted/10">
                        <td className="px-6 py-4 font-medium">{bid.bidder_name}</td>
                        <td className="px-6 py-4 font-bold text-primary">${bid.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-400">{bid.bidder_email || "N/A"}</td>
                        <td className="px-6 py-4 text-slate-500 text-right">{new Date(bid.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AUDIO LAB TAB */}
          {activeTab === 'Audio Lab' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Audio Lab</h3>
                  <p className="text-sm text-slate-400">Manage your public music library and featured site tracks.</p>
                </div>
                <label className="px-6 py-2.5 bg-primary text-background-dark font-black rounded-lg hover:opacity-90 cursor-pointer flex items-center gap-2 text-sm uppercase tracking-wider transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  Upload Tracks
                  <input type="file" multiple accept="audio/*" className="hidden" />
                </label>
              </div>

              {/* Upload Dropzone Placeholder */}
              <div className="border-2 border-dashed border-moss-border rounded-xl p-12 flex flex-col items-center justify-center text-center bg-moss-muted/10 hover:bg-moss-muted/20 transition-colors">
                <div className="w-16 h-16 rounded-full bg-moss-muted/50 flex items-center justify-center mb-4 text-slate-400">
                  <span className="material-symbols-outlined text-3xl">library_music</span>
                </div>
                <h4 className="text-lg font-medium mb-2">Drag and drop audio files</h4>
                <p className="text-sm text-slate-500 max-w-sm">
                  Upload high-fidelity .wav or .mp3 files. Files are automatically processed through the global CDN.
                </p>
              </div>

              {/* Track Library Placeholder */}
              <div className="space-y-4 pt-4 border-t border-moss-border">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
                  Public Library
                </h4>
                <div className="overflow-hidden border border-moss-border rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-moss-muted text-slate-400 font-medium border-b border-moss-border">
                      <tr>
                        <th className="px-6 py-3 w-12"></th>
                        <th className="px-6 py-3">Track Details</th>
                        <th className="px-6 py-3">Duration</th>
                        <th className="px-6 py-3">Featured Track</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-moss-border">
                      {/* Placeholder row for existing global audio */}
                      <tr className="bg-moss-muted/10 hover:bg-moss-muted/20 transition-colors group">
                        <td className="px-6 py-4">
                          <button className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px] ml-0.5">play_arrow</span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-200">The Cedar Solace</p>
                          <p className="text-xs text-slate-500 mt-1">432Hz (A4) • Western Red Cedar</p>
                        </td>
                        <td className="px-6 py-4 text-slate-400">15:00</td>
                        <td className="px-6 py-4">
                          <button className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full text-xs font-bold border border-primary/20">
                            <span className="material-symbols-outlined text-[14px]">star</span>
                            Active
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Actions (Only for Drops) */}
        {activeTab === 'Manage Drops' && (
          <footer className="fixed bottom-0 md:left-64 right-0 border-t border-moss-border bg-[#121a12] p-4 flex items-center justify-between z-40">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">cloud_done</span>
              Auto-saved securely to cloud
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleLaunch}
                disabled={isPublishing}
                className="px-8 py-2.5 bg-primary text-background-dark rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isPublishing ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
                Launch Drop to Live
              </button>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}
