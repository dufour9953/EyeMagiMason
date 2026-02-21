import { supabase } from "../../lib/supabase";
import { Navigation } from "../components/Navigation";
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Echoes | iMagiMason',
  description: 'Chronicles, processes, and echoes from the high desert woodworking studio.',
};

// Next.js Server Component (optimal SEO and initial load)
export default async function JournalPage() {
  const { data: stories } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen pt-32 pb-24 text-slate-100">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            The <span className="text-gradient">Echoes</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-light">
            Chronicles from the high desert. Stories of cedar, obsidian, and sonic echoes hand-carved in solitude.
          </p>
        </div>

        {(!stories || stories.length === 0) ? (
          <div className="py-24 text-center border border-dashed border-moss-border rounded-2xl bg-moss-muted/10">
            <p className="text-slate-500 font-medium">The echoes are currently quiet. Check back soon for new stories.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {stories.map((story) => (
              <article 
                key={story.id} 
                className="bg-moss-muted/20 border border-moss-border rounded-2xl p-8 md:p-12 hover:border-primary/30 transition-all group relative overflow-hidden"
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none"></div>

                <div className="relative z-10">
                  <header className="mb-8 border-b border-moss-border pb-6">
                    <time className="text-primary font-mono text-sm tracking-wider uppercase mb-3 block">
                      {new Date(story.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-100 leading-tight">
                      {story.title}
                    </h2>
                  </header>

                  <div 
                    className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed prose-headings:text-slate-100 prose-a:text-primary hover:prose-a:text-white prose-a:transition-colors max-w-none"
                    dangerouslySetInnerHTML={{ __html: story.content }}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
