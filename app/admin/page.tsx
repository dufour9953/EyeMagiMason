"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useUI } from "../contexts/UIContext";
import { useAudio } from "../contexts/AudioContext"; // Now pulling in the global audio player

export default function AdminDashboard() {
  const { openPreviewModal } = useUI();
  const { togglePlay, isPlaying, setAudioSource, currentTrack } = useAudio();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Main Navigation State
  const [activeTab, setActiveTab] = useState("Overview");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // New Admin Data States
  const [stats, setStats] = useState({ highBid: 0, bidCount: 0 });
  const [allBids, setAllBids] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({
    'about_text': '',
    'hero_subtitle': ''
  });
  const [isSavingContent, setIsSavingContent] = useState(false);

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

  // Audio Lab Form States
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [libraryCoverArt, setLibraryCoverArt] = useState<File | null>(null);
  const [libraryAudioFile, setLibraryAudioFile] = useState<File | null>(null);
  const [trackTitle, setTrackTitle] = useState("");
  const [trackWood, setTrackWood] = useState("");
  const [trackTuning, setTrackTuning] = useState("");
  const [trackDuration, setTrackDuration] = useState("");
  const [isTrackFeatured, setIsTrackFeatured] = useState(false);
  const [isSavingTrack, setIsSavingTrack] = useState(false);

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
      const { data: eData } = await supabase.from('calendar_events').select('*').order('event_date', { ascending: true });
      if (eData) setEvents(eData);

      // Fetch global site content
      const { data: contentData } = await supabase.from('site_content').select('*');
      if (contentData) {
        const contentMap: Record<string, string> = {};
        contentData.forEach(item => {
          contentMap[item.id] = item.content;
        });
        setSiteContent(prev => ({ ...prev, ...contentMap }));
      }
      
      const { data: aData } = await supabase.from('audio_tracks').select('*').order('created_at', { ascending: false });
      if (aData) setAudioTracks(aData);
    };
    
    if (!loading) {
      fetchAdminData();
    }
  }, [loading]);

  const handleSaveSiteContent = async () => {
    setIsSavingContent(true);
    try {
      const updates = [
        { id: 'hero_subtitle', content: siteContent.hero_subtitle || '' },
        { id: 'about_text', content: siteContent.about_text || '' },
      ];
      
      const { error } = await supabase.from('site_content').upsert(updates);
      if (error) throw error;
      alert('Global copy successfully updated!');
    } catch (err: any) {
      alert('Failed to save content: ' + err.message);
    } finally {
      setIsSavingContent(false);
    }
  };

  const [isSavingStory, setIsSavingStory] = useState(false);
  
  const handleSaveStory = async () => {
    if (!storyTitle || !storyContent) return;
    setIsSavingStory(true);
    try {
      const { error } = await supabase.from('stories').insert([{
        title: storyTitle,
        content: storyContent,
        status: 'DRAFT'
      }]);
      
      if (error) throw error;
      alert("Story saved successfully!");
      setStoryTitle("");
      setStoryContent("");
      // Refresh the stories list
      const { data: sData } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
      if (sData) setStories(sData);
    } catch (err: any) {
      alert("Error saving story: " + err.message);
    } finally {
      setIsSavingStory(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if(!confirm("Are you sure you want to delete this story?")) return;
    try {
      const { error } = await supabase.from('stories').delete().eq('id', id);
      if (error) throw error;
      setStories(stories.filter(s => s.id !== id));
    } catch (err: any) {
      alert("Error deleting story: " + err.message);
    }
  }

  const handleSaveTrack = async () => {
    if (!trackTitle || !libraryAudioFile || !libraryCoverArt) {
      alert("Please provide a title, audio file, and cover art.");
      return;
    }
    setIsSavingTrack(true);
    try {
      const coverUrl = await uploadFile(libraryCoverArt, 'flute-images');
      const audioUrl = await uploadFile(libraryAudioFile, 'exclusive-audio');
      
      const { error } = await supabase.from('audio_tracks').insert([{
        title: trackTitle,
        wood_type: trackWood,
        tuning: trackTuning,
        duration: trackDuration,
        is_featured: isTrackFeatured,
        cover_art_url: coverUrl,
        audio_url: audioUrl
      }]);
      
      if (error) throw error;
      alert("Track saved to library!");
      
      setTrackTitle("");
      setTrackWood("");
      setTrackTuning("");
      setTrackDuration("");
      setIsTrackFeatured(false);
      setLibraryCoverArt(null);
      setLibraryAudioFile(null);
      
      const { data: aData } = await supabase.from('audio_tracks').select('*').order('created_at', { ascending: false });
      if (aData) setAudioTracks(aData);
    } catch (err: any) {
      alert("Failed to save track: " + err.message);
    } finally {
      setIsSavingTrack(false);
    }
  };

  const handleDeleteTrack = async (id: string) => {
    if(!confirm("Delete this track from the library?")) return;
    try {
      const { error } = await supabase.from('audio_tracks').delete().eq('id', id);
      if (error) throw error;
      setAudioTracks(audioTracks.filter(t => t.id !== id));
    } catch (err: any) {
      alert("Error deleting track: " + err.message);
    }
  };

  const [isSavingEvent, setIsSavingEvent] = useState(false);

  const handleSaveEvent = async () => {
    if(!eventTitle || !eventDate) return;
    setIsSavingEvent(true);
    try {
      const { error } = await supabase.from('calendar_events').insert([{
        title: eventTitle,
        event_date: eventDate,
        location: eventLocation || null
      }]);

      if (error) throw error;
      alert("Event scheduled successfully!");
      setEventTitle("");
      setEventDate("");
      setEventLocation("");
      // Refresh the events list
      const { data: eData } = await supabase.from('calendar_events').select('*').order('event_date', { ascending: true });
      if (eData) setEvents(eData);
    } catch (err: any) {
      alert("Error saving event: " + err.message);
    } finally {
      setIsSavingEvent(false);
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if(!confirm("Are you sure you want to delete this event?")) return;
    try {
      const { error } = await supabase.from('calendar_events').delete().eq('id', id);
      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
    } catch (err: any) {
      alert("Error deleting event: " + err.message);
    }
  }

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
        start_time: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : null,
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
      setStartTime("");
      setEndTime("");
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
        <header className="h-16 border-b border-moss-border px-4 md:px-8 shrink-0 flex items-center justify-between sticky top-0 bg-[#121a12]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">{activeTab}</h2>
            {activeTab === 'Manage Drops' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-moss-muted text-slate-400 uppercase tracking-widest border border-moss-border">Drafting</span>}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/drop" className="text-xs md:text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">Preview Storefront</Link>
            
            {/* Mobile Logout Button */}
            <button 
              onClick={handleLogout} 
              title="Log Out"
              className="lg:hidden w-8 h-8 rounded-full bg-moss-muted/50 text-slate-400 hover:text-red-400 hover:bg-red-400/10 flex items-center justify-center transition-colors border border-moss-border"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Horizontal Sub-Navigation */}
        <nav className="lg:hidden flex border-b border-moss-border px-4 py-3 overflow-x-auto whitespace-nowrap hide-scrollbar gap-2 bg-[#121a12]/95 backdrop-blur-md z-10 shrink-0">
          {['Overview', 'Manage Drops', 'Site Content', 'Story Editor', 'Calendar', 'Bids & Results', 'Audio Lab'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 border ${
                activeTab === tab 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-moss-muted/30 text-slate-400 border-moss-border hover:text-primary hover:border-primary/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 custom-scrollbar pb-32">
          
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
                  <div className="overflow-x-auto border border-moss-border rounded-xl">
                  <table className="w-full text-left text-sm min-w-[400px]">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Start Time</label>
                      <input 
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-[color-mix(in_srgb,var(--moss-muted),rgba(255,255,255,0.05))] border border-moss-border rounded-lg focus:ring-primary text-slate-100 px-4 py-2.5 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">End Time</label>
                      <input 
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-[color-mix(in_srgb,var(--moss-muted),rgba(255,255,255,0.05))] border border-moss-border rounded-lg focus:ring-primary text-slate-100 px-4 py-2.5 outline-none" 
                      />
                    </div>
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
          {activeTab === 'Site Content' && (
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-xl font-bold mb-1">Global Site Copy</h3>
                   <p className="text-slate-400 text-sm">Update the core messaging across the public website.</p>
                 </div>
                 <button 
                   onClick={handleSaveSiteContent}
                   disabled={isSavingContent}
                   className={`px-6 py-2 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 text-sm uppercase tracking-wider transition-opacity ${isSavingContent ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   {isSavingContent ? 'Saving...' : 'Save Changes'}
                 </button>
               </div>

               <div className="grid gap-6">
                 {/* Hero Subtitle */}
                 <div className="bg-moss-muted/20 border border-moss-border p-6 rounded-xl space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-200">Landing Page Subtitle</h4>
                      <p className="text-xs text-slate-400">The text appearing directly under the main iMagiMason logo.</p>
                    </div>
                    <textarea 
                      value={siteContent.hero_subtitle || ''}
                      onChange={(e) => setSiteContent(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                      className="w-full bg-background border border-moss-border rounded-lg text-slate-100 px-4 py-3 outline-none min-h-[100px] resize-y focus:border-primary/50 transition-colors"
                      placeholder="Breathing life into wood, weaving sound into soul..."
                    />
                 </div>

                 {/* About Text */}
                 <div className="bg-moss-muted/20 border border-moss-border p-6 rounded-xl space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-200">The Story (About Modal)</h4>
                      <p className="text-xs text-slate-400">The origin story text displayed when users click the bio signature or 'About' link.</p>
                    </div>
                    <textarea 
                      value={siteContent.about_text || ''}
                      onChange={(e) => setSiteContent(prev => ({ ...prev, about_text: e.target.value }))}
                      className="w-full bg-background border border-moss-border rounded-lg text-slate-100 px-4 py-3 outline-none min-h-[250px] resize-y focus:border-primary/50 transition-colors"
                      placeholder="Born in the quiet rain shadow..."
                    />
                 </div>
               </div>
             </div>
          )}

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
                   <button 
                     disabled={isSavingStory || !storyTitle || !storyContent}
                     onClick={handleSaveStory}
                     className="px-6 py-2 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider transition-opacity">
                     {isSavingStory ? 'Saving...' : 'Publish Story'}
                   </button>
                 </div>
               </div>

               <div className="bg-moss-muted/10 border border-moss-border rounded-xl overflow-hidden flex flex-col">
                 <input 
                   value={storyTitle}
                   onChange={(e) => setStoryTitle(e.target.value)}
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
                   value={storyContent}
                   onChange={(e) => setStoryContent(e.target.value)}
                   className="w-full bg-transparent text-slate-300 px-8 py-6 outline-none min-h-[400px] leading-relaxed resize-none placeholder:text-slate-600 custom-scrollbar" 
                   placeholder="Begin weaving the tale here. What inspired this piece? What happened in the woods?"
                 ></textarea>
               </div>
               
               {/* List of Published Stories */}
               {stories.length > 0 && (
                 <div className="mt-8 space-y-4 border-t border-moss-border pt-8">
                    <h3 className="text-lg font-bold">Published Stories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stories.map(story => (
                        <div key={story.id} className="bg-moss-muted/20 border border-moss-border p-4 rounded-xl flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-200">{story.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">Written {new Date(story.created_at).toLocaleDateString()}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteStory(story.id)}
                            className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                            title="Delete Story"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                 </div>
               )}
             </div>
          )}

          {activeTab === 'Calendar' && (
             <div className="bg-moss-muted/20 border border-moss-border p-8 rounded-xl min-h-[400px]">
               <h3 className="text-xl font-bold mb-4">Editorial & Event Calendar</h3>
               <div className="flex flex-col md:flex-row gap-4 mb-8">
                 <input 
                   value={eventTitle}
                   onChange={(e) => setEventTitle(e.target.value)}
                   className="flex-1 bg-moss-muted border border-moss-border rounded-lg px-4 py-2 text-slate-100 outline-none focus:border-primary/50" 
                   placeholder="Event Name (e.g., Redwood Flute Release)" 
                 />
                 <input 
                   value={eventLocation}
                   onChange={(e) => setEventLocation(e.target.value)}
                   className="flex-1 bg-moss-muted border border-moss-border rounded-lg px-4 py-2 text-slate-100 outline-none focus:border-primary/50" 
                   placeholder="Location (Optional)" 
                 />
                 <input 
                   type="datetime-local" 
                   value={eventDate}
                   onChange={(e) => setEventDate(e.target.value)}
                   className="bg-moss-muted border border-moss-border rounded-lg px-4 py-2 text-slate-100 outline-none focus:border-primary/50" 
                 />
                 <button 
                   disabled={isSavingEvent || !eventTitle || !eventDate}
                   onClick={handleSaveEvent}
                   className="px-6 py-2 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                     {isSavingEvent ? 'Scheduling...' : 'Schedule Event'}
                 </button>
               </div>

               {/* Upcoming Events List */}
               {events.length > 0 ? (
                 <div className="space-y-3">
                   {events.map(event => (
                     <div key={event.id} className="bg-moss-muted/40 border border-moss-border p-4 rounded-lg flex justify-between items-center group">
                       <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                         <div className="flex flex-col">
                           <h4 className="font-bold text-slate-200">{event.title}</h4>
                           {event.location && <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{event.location}</span>}
                         </div>
                         <div className="flex items-center gap-2 text-slate-300 bg-black/20 px-3 py-1.5 rounded-md border border-white/5">
                           <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
                           <span className="text-sm font-medium">{new Date(event.event_date).toLocaleString()}</span>
                         </div>
                       </div>
                       <button 
                         onClick={() => handleDeleteEvent(event.id)}
                         className="text-slate-500 hover:text-red-400 p-2 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                         title="Delete Event"
                       >
                         <span className="material-symbols-outlined text-lg">delete</span>
                       </button>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-slate-500 text-center py-8">No upcoming events scheduled.</p>
               )}
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
              </div>

              {/* Upload Form */}
              <div className="bg-moss-muted/20 border border-moss-border rounded-xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Track Information</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300">Track Title</label>
                    <input value={trackTitle} onChange={e => setTrackTitle(e.target.value)} className="w-full bg-moss-muted border border-moss-border rounded-lg px-3 py-2 outline-none" placeholder="e.g. Dawn Chorus" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300">Wood Type</label>
                      <input value={trackWood} onChange={e => setTrackWood(e.target.value)} className="w-full bg-moss-muted border border-moss-border rounded-lg px-3 py-2 outline-none" placeholder="Cherry Wood" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300">Tuning Key</label>
                      <input value={trackTuning} onChange={e => setTrackTuning(e.target.value)} className="w-full bg-moss-muted border border-moss-border rounded-lg px-3 py-2 outline-none" placeholder="432Hz (G4)" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300">Duration (MM:SS)</label>
                      <input value={trackDuration} onChange={e => setTrackDuration(e.target.value)} className="w-full bg-moss-muted border border-moss-border rounded-lg px-3 py-2 outline-none" placeholder="03:45" />
                    </div>
                    <div className="flex items-center gap-2 pt-8">
                      <input type="checkbox" id="feature" checked={isTrackFeatured} onChange={e => setIsTrackFeatured(e.target.checked)} className="cursor-pointer" />
                      <label htmlFor="feature" className="text-sm cursor-pointer hover:text-primary">Featured Track</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Media Assets</h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300">Cover Art Image (Required)</label>
                    <input type="file" accept="image/*" onChange={e => setLibraryCoverArt(e.target.files?.[0] || null)} className="w-full bg-moss-muted/30 border border-dashed border-moss-border text-slate-400 p-3 rounded-lg cursor-pointer text-sm" />
                    {libraryCoverArt && <p className="text-xs text-primary font-bold">Queued: {libraryCoverArt.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300">Audio File (Required WAV/MP3)</label>
                    <input type="file" accept="audio/*" onChange={e => setLibraryAudioFile(e.target.files?.[0] || null)} className="w-full bg-moss-muted/30 border border-dashed border-moss-border text-slate-400 p-3 rounded-lg cursor-pointer text-sm" />
                    {libraryAudioFile && <p className="text-xs text-primary font-bold">Queued: {libraryAudioFile.name}</p>}
                  </div>
                  <button onClick={handleSaveTrack} disabled={isSavingTrack} className="w-full mt-4 bg-primary text-background-dark font-black rounded-lg py-3 hover:opacity-90 transition-opacity">
                    {isSavingTrack ? 'UPLOADING...' : 'SAVE TRACK TO LIBRARY'}
                  </button>
                </div>
              </div>

              {/* Track Library List */}
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
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-moss-border">
                      {audioTracks.map((track) => (
                        <tr key={track.id} className="bg-moss-muted/10 hover:bg-moss-muted/20 transition-colors group">
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => {
                                if (currentTrack?.title === track.title) {
                                  togglePlay();
                                } else {
                                  setAudioSource(track.audio_url, track.title, `${track.wood_type} • ${track.tuning}`);
                                }
                              }}
                              className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/40 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px] ml-0.5">
                                {isPlaying && currentTrack?.title === track.title ? 'pause' : 'play_arrow'}
                              </span>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={track.cover_art_url} alt="Cover" className="w-10 h-10 rounded object-cover" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-slate-200">{track.title}</p>
                                  {track.is_featured && <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] uppercase font-bold border border-primary/20">Featured</span>}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{track.tuning} • {track.wood_type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-400">{track.duration}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDeleteTrack(track.id)} className="text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {audioTracks.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No tracks have been added to the library yet.</td>
                        </tr>
                      )}
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
