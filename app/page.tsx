import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">fluid</span>
            <span className="text-xl font-black tracking-tighter uppercase">iMagiMason</span>
          </div>
          <div className="hidden md:flex items-center gap-12">
            <Link className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest" href="#story">Story</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest" href="#drops">Drops</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest" href="#listen">Listen</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="hidden lg:flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-5 py-2 rounded-lg border border-primary/20 transition-all text-sm font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
              Admin
            </Link>
            <Link href="#drops" className="bg-primary text-background-dark px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all">
              Next Drop
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terracotta/20 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 uppercase text-gradient">
            iMagiMason
          </h1>
          <p className="text-xl md:text-2xl font-light text-slate-400 mb-10 tracking-wide leading-relaxed">
            Breathing life into wood, <span className="text-slate-200">weaving sound into soul.</span><br />
            1-of-1 handcrafted flutes and their exclusive sonic echoes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/drop" className="w-full sm:w-auto px-10 py-4 bg-primary text-background-dark font-bold rounded-xl text-lg uppercase tracking-widest hover:scale-105 transition-transform">
              View Next Drop
            </Link>
          </div>
        </div>
      </section>

      {/* Artist Story Section */}
      <section className="py-24 px-6 bg-charcoal/50" id="story">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
            <img 
              alt="Mason carving a flute in a sunlit studio" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd2hxeTngbve_tHyDrHrBcElBstHcxTXporVZKZoLP8CRkeyDmJRPT85UNLrJ-a8HB4eQfS9R51qmTIwdeVfNyun13OGgyhCcqLrZAZCxiwHJduA0SftwOrthj-e8OLIDwjOrPjANmyF7HMIbso75q_WkC8_1bah2C0BXY7ity_ohheiP12Agd5POUzx_ut6EO7FOtq1pjnDkC9_-d-TxAjrOWqwHaRDhl6YYPHzWTjs_ZqQlUERPbJmR48QsvYOlaWpUPA9ykZ9A"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">The Maker</p>
              <h3 className="text-3xl font-bold">Mason Thorne</h3>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl font-black uppercase tracking-tight">The Craft &amp; <br /><span className="text-primary">The Chord</span></h2>
            <div className="space-y-6 text-lg text-slate-400 font-light leading-relaxed">
              <p>
                Every iMagiMason piece begins in the silence of the high desert. Mason selects fallen cedar and obsidian, listening to the natural grain before the first cut is even made.
              </p>
              <p>
                Each flute is a singular existence—a 1-of-1 sculptural instrument tuned to a unique frequency. Once carved, Mason composes a dedicated atmospheric track that can only be unlocked by the owner of that specific flute.
              </p>
              <p>
                This isn't just an auction; it's a transfer of a soul-bound artifact. From raw earth to digital resonance, the journey is complete only when the first breath passes through the wood.
              </p>
            </div>
            <div className="flex gap-12 pt-6">
              <div>
                <p className="text-primary text-3xl font-black">42</p>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Flutes Crafted</p>
              </div>
              <div>
                <p className="text-primary text-3xl font-black">100%</p>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Unique Echoes</p>
              </div>
              <div>
                <p className="text-primary text-3xl font-black">01</p>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Legacy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Drop Card */}
      <section className="py-24 px-6" id="drops">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs">Featured Collection</span>
              <h2 className="text-4xl font-black uppercase mt-2">The Cedar Solace</h2>
            </div>
            <div className="flex items-center gap-4 bg-charcoal p-4 rounded-xl border border-white/5">
              <div className="text-center px-4">
                <p className="text-2xl font-black text-primary">02</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Days</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center px-4">
                <p className="text-2xl font-black text-primary">14</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Hrs</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center px-4">
                <p className="text-2xl font-black text-primary">56</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Min</p>
              </div>
            </div>
          </div>
          
          <Link href="/drop" className="block relative group cursor-pointer overflow-hidden rounded-3xl bg-charcoal border border-white/5">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-[500px] overflow-hidden">
                <img 
                  alt="Handcarved cedar flute with turquoise inlay" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN8HTIaCXi_YhxUea97yP8sWI4oO1BtOEzESOT1KehSU0vxWPDKXs3ZjRit7uKN__jcXVrC7bB1o3IM95Pw2qALP0eVhupvrLLzBDcfM110sjHFw8uG-Hvnb3e9HqRa4tzJgj6XUHdcTzndezkOrgJygirQN5j6Dr82lSs_r7C-xm--QwK13PlXqQVFZv-5H2E8XtQU5bHo5OHOr-BdyZ85ennpoNlfN1pAGbm18uORy_uwxWKdq8R-T5yZj_oTqD36wIoxoOaS8A"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal hidden lg:block"></div>
              </div>
              <div className="p-12 flex flex-col justify-center space-y-8">
                <div>
                  <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-primary/20">Live Auction</span>
                  <h3 className="text-4xl font-black uppercase leading-tight">Solace No. 12 <br /><span className="text-slate-500">"Wind Over Water"</span></h3>
                </div>
                <p className="text-slate-400 font-light text-lg">
                  Crafted from a 200-year-old cedar root found in the Olympic Peninsula. Features a master recording of "The Solace Suite" in lossless format.
                </p>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Current Bid</p>
                    <p className="text-3xl font-black text-white">4.50 ETH</p>
                  </div>
                  <div className="h-12 w-px bg-white/10"></div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Artist</p>
                    <p className="text-xl font-bold text-slate-300">Mason</p>
                  </div>
                </div>
                <div className="w-full py-5 text-center bg-primary text-background-dark font-black text-xl uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(238,173,43,0.3)] transition-all">
                  Enter Drop
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Drop Timeline */}
      <section className="py-24 px-6 bg-background-dark/80">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black uppercase mb-12 flex items-center gap-4">
            <span className="material-symbols-outlined text-primary">history</span>
            The Timeline
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Upcoming Card */}
            <div className="bg-charcoal/30 border border-white/5 p-8 rounded-2xl hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-4xl text-slate-600 group-hover:text-primary transition-colors">upcoming</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full text-white">Dec 12</span>
              </div>
              <h4 className="text-xl font-bold uppercase mb-2">Obsidian Echoes</h4>
              <p className="text-slate-500 text-sm font-light mb-6">A darker, stone-based resonance crafted for midnight meditations.</p>
              <button className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                Notify Me <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            
            {/* Live Card */}
            <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-4xl text-primary">sensors</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-background-dark px-3 py-1 rounded-full">Live Now</span>
              </div>
              <h4 className="text-xl font-bold uppercase mb-2">The Cedar Solace</h4>
              <p className="text-slate-400 text-sm font-light mb-6">Our most complex acoustic carving to date. Currently in auction phase.</p>
              <Link href="/drop" className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                View Bids <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            
            {/* Past Card */}
            <div className="bg-charcoal/30 border border-white/5 p-8 rounded-2xl opacity-60 hover:opacity-100 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-4xl text-terracotta">lock</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-terracotta/20 text-terracotta px-3 py-1 rounded-full">Collected</span>
              </div>
              <h4 className="text-xl font-bold uppercase mb-2">Ancient Breath</h4>
              <p className="text-slate-500 text-sm font-light mb-6">A maple-wood flute featuring hand-hammered copper accents.</p>
              <button className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                View Archive <span className="material-symbols-outlined text-sm">history</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Player / Footer */}
      <footer className="py-20 px-6 border-t border-white/5" id="listen">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="w-full md:w-1/3">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">fluid</span>
              <span className="text-lg font-black tracking-tighter uppercase">iMagiMason</span>
            </div>
            <p className="text-slate-500 text-sm font-light leading-relaxed">
              Designed at the intersection of ancient artisan craft and modern digital ownership. Each breath recorded for eternity.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-charcoal p-6 rounded-2xl flex items-center gap-6 border border-white/5">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 group">
              <img 
                alt="Ambient waveform art" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqjUUFdP3D9JDSuzJIQBKANka6g02iMVb8766dslxX6Vtn76qMt12bug2IM--1-uGMKGSt5tzaRcg8r51OFfEd1ZRluAG-01PaIPKy6SUF1BMHuFCjhBG1VecKyFmvEBsDQeKfg4PYHgsaw2BqKNtKpp_Rx4c2QuMrBkjWrBtjlTD3SDwOlwxjed4fJ-8d-g3HHOloMvCJ7L8nzklKKDp1XjsvUQrU-swlMdJzdsQgW4t5ptwKBl9zYO6QpRdfvhqT9VX7qJ37up8"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="material-symbols-outlined text-white">play_arrow</span>
              </div>
            </div>
            <div className="grow">
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Now Previewing</p>
              <p className="text-lg font-bold uppercase mb-2">Echo of the High Desert</p>
              <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
                <div className="h-full bg-primary w-1/3"></div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="material-symbols-outlined cursor-pointer hover:text-white transition-colors">skip_previous</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-white transition-colors text-4xl">play_circle</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-white transition-colors">skip_next</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-bold uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} iMagiMason Studio. All rights reserved.</p>
          <div className="flex gap-8">
            <Link className="hover:text-primary transition-colors" href="#">Privacy</Link>
            <Link className="hover:text-primary transition-colors" href="#">Terms</Link>
            <Link className="hover:text-primary transition-colors" href="#">Instagram</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
