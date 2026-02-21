import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#121a12] text-slate-100 font-display">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-moss-border bg-moss-muted/30 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-background-dark font-bold text-xl">M</div>
          <div>
            <h1 className="text-sm font-bold tracking-tight uppercase">iMagiMason</h1>
            <p className="text-xs text-slate-400">Artist Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-sm font-medium">Overview</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[20px]">brush</span>
            <span className="text-sm font-medium">Manage Drops</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            <span className="text-sm font-medium">Story Editor</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span className="text-sm font-medium">Calendar</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">gavel</span>
            <span className="text-sm font-medium">Bids &amp; Results</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-moss-border">
          <Link href="/" className="flex w-full items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 transition-colors">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm font-medium">Log Out To Home</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-moss-border px-8 flex items-center justify-between sticky top-0 bg-[#121a12]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Manage Drops</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-moss-muted text-slate-400 uppercase tracking-widest border border-moss-border">Drafting</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/drop" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">Preview Storefront</Link>
            <button className="bg-primary text-background-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">publish</span>
              Publish Drop
            </button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full space-y-8 custom-scrollbar">
          {/* Stats Overview Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-moss-muted/50 border border-moss-border p-6 rounded-xl flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Next Scheduled Drop</p>
              <p className="text-2xl font-bold">Oct 24, 12:00 PM</p>
              <div className="flex items-center gap-1 text-primary text-xs font-medium">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                Starts in 2 days, 4 hours
              </div>
            </div>
            <div className="bg-moss-muted/50 border border-moss-border p-6 rounded-xl flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active High Bid</p>
              <p className="text-2xl font-bold text-primary">$1,250.00</p>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +15% from starting bid
              </div>
            </div>
            <div className="bg-moss-muted/50 border border-moss-border p-6 rounded-xl flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Portfolio Value</p>
              <p className="text-2xl font-bold">$45,800.00</p>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                32 items sold to date
              </div>
            </div>
          </div>

          {/* Main Form Section */}
          <div className="bg-moss-muted/20 border border-moss-border rounded-xl overflow-hidden">
            <div className="border-b border-moss-border flex gap-8 px-8">
              <button className="py-4 border-b-2 border-primary text-sm font-bold text-slate-100">Flute &amp; Song Details</button>
              <button className="py-4 border-b-2 border-transparent text-sm font-bold text-slate-500 hover:text-slate-300">Auction Rules</button>
              <button className="py-4 border-b-2 border-transparent text-sm font-bold text-slate-500 hover:text-slate-300">Bidders (12)</button>
            </div>
            
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Form Inputs */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Flute Title</label>
                  <input className="w-full bg-moss-muted border border-moss-border rounded-lg focus:ring-primary focus:border-primary text-slate-100 px-4 py-2.5 outline-none" placeholder="e.g. The Cedar Whisperer" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Artist Description</label>
                  <textarea className="w-full bg-moss-muted border border-moss-border rounded-lg focus:ring-primary focus:border-primary text-slate-100 px-4 py-2.5 outline-none custom-scrollbar" placeholder="Tell the story of the wood, the carve, and the spirit..." rows={5}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Starting Bid (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                      <input className="w-full bg-moss-muted border border-moss-border rounded-lg focus:ring-primary focus:border-primary text-slate-100 pl-8 pr-4 py-2.5 outline-none" placeholder="500.00" type="number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Drop Date</label>
                    <input className="w-full bg-moss-muted border border-moss-border rounded-lg focus:ring-primary focus:border-primary text-slate-100 px-4 py-2.5 outline-none" type="datetime-local" />
                  </div>
                </div>
              </div>

              {/* Right: Media Uploads */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Flute Media (Images)</label>
                  <div className="border-2 border-dashed border-moss-border bg-moss-muted/30 rounded-xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-moss-muted/50 transition-colors">
                    <span className="material-symbols-outlined text-4xl text-slate-500 mb-2 group-hover:text-primary transition-colors">image</span>
                    <p className="text-sm text-slate-400 font-medium">Drag and drop high-res flute photos</p>
                    <p className="text-xs text-slate-600 mt-1">Recommended: 4:5 aspect ratio, min 2000px</p>
                    <button className="mt-4 px-4 py-1.5 text-xs font-bold border border-moss-border rounded hover:bg-moss-border transition-colors">Select Files</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    <div className="aspect-square bg-moss-muted rounded-lg border border-moss-border overflow-hidden relative group">
                      <img className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6sS8COdyYCMeEBUCe7Eh7rgP0W4SgUqbvNoM9PGTEYT0ID3DDxnKYGux2wizGnGgdoM22m9Wp_qAPPKn6fj5kthpmdeNno1E5LEazYEdy9Ys3tkkYnlwDVk0u8vM4wL4zzbMdryEIr6TLwlAk4HWbcNtw59OI_6wqj8m7Qvl6VxlVqt7TympDtDM_l_dAUXiwpxVpcaCBjYYxunPW9LWZXTQYU9IfQDyVx7Mj5XDQsDmCposfT2U4BCh3A4L6fFsKhGm9uF_IU-o" alt="Gallery preview" />
                      <button className="absolute top-1 right-1 h-5 w-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[12px]">close</span>
                      </button>
                    </div>
                    <div className="aspect-square border-2 border-dashed border-moss-border rounded-lg flex items-center justify-center text-slate-600">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Exclusive Song Release (MP4/WAV)</label>
                  <div className="bg-moss-muted border border-moss-border rounded-lg p-4 flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">music_note</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Spirit_of_the_Wilds.mp4</p>
                      <p className="text-xs text-slate-500">12.4 MB • Uploaded</p>
                      <div className="w-full bg-[#121a12] h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-full"></div>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-red-400">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity/Bid History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Global Activity
            </h3>
            <div className="overflow-hidden border border-moss-border rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-moss-muted text-slate-400 font-medium border-b border-moss-border">
                  <tr>
                    <th className="px-6 py-3">Collector</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">Item</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-moss-border">
                  <tr className="bg-moss-muted/10 hover:bg-moss-muted/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-700"></div>
                      <span className="font-medium">Luna_Echoes</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded">Bid Placed</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">The Cedar Whisperer</td>
                    <td className="px-6 py-4 font-bold text-primary">$1,250.00</td>
                    <td className="px-6 py-4 text-slate-500 text-right">2m ago</td>
                  </tr>
                  <tr className="bg-moss-muted/10 hover:bg-moss-muted/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-600"></div>
                      <span className="font-medium">WindWalker_99</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded">Watching</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">The Cedar Whisperer</td>
                    <td className="px-6 py-4 font-bold">—</td>
                    <td className="px-6 py-4 text-slate-500 text-right">15m ago</td>
                  </tr>
                  <tr className="bg-moss-muted/10 hover:bg-moss-muted/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800"></div>
                      <span className="font-medium">DeepRoot_Collector</span>
                    </td>
                    <td className="px-6 py-4">
                      <span class="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded">Bid Placed</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">The Cedar Whisperer</td>
                    <td className="px-6 py-4 font-bold text-primary">$1,100.00</td>
                    <td className="px-6 py-4 text-slate-500 text-right">44m ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <footer className="mt-auto border-t border-moss-border bg-moss-muted/50 p-6 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">cloud_done</span>
            Auto-saved at 10:45 AM
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-moss-border rounded-lg text-sm font-semibold hover:bg-moss-border transition-colors">Save as Draft</button>
            <button className="px-10 py-2 bg-primary text-background-dark rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity">
              Launch Auction
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
