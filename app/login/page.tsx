"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 font-display">
      <Link href="/" className="flex items-center gap-2 mb-12 text-slate-400 hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Return to Portal
      </Link>
      
      <div className="w-full max-w-sm p-8 glass-panel border border-primary/20 shadow-2xl rounded-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/30">
            <span className="material-symbols-outlined text-primary text-2xl">vpn_key</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 uppercase tracking-tight">Admin Protocol</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest text-center">Authorized Access Only</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">mail</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-slate-100 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="mason@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Master Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[18px]">lock</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-slate-100 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-background-dark font-black py-4 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}
