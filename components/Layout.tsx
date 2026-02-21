import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, Mic2, Home } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  return (
    <div className="min-h-screen flex flex-col text-white selection:bg-orange-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Image - Atlanta Skyline from Google Drive */}
      {/* Updated to use the 'lh3.googleusercontent.com/d/' format which is more reliable for high-res embedding */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
        style={{ 
          backgroundImage: `url('https://lh3.googleusercontent.com/d/1dktBbvCv7O-0-krBVKRETfrMvYsFRIry=w2400')` 
        }}
      />
      
      {/* "Tent" (Tint) Overlay - Darkened for readability */}
      <div className="fixed inset-0 z-0 bg-black/85 pointer-events-none backdrop-blur-[2px]" />

      {/* Ambient Gradient Overlays for Vibe */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
         <div className="absolute top-[-20%] left-[20%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity group">
            {/* Logo Icon */}
            <div className="bg-gradient-to-br from-orange-400 to-red-600 p-2.5 rounded-xl text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] border border-orange-400/20 group-hover:scale-105 transition-transform">
              <Mic2 size={24} strokeWidth={2.5} className="text-white" />
            </div>
            
            {/* Text Logo */}
            <div className="flex flex-col justify-center h-full">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none brand-font drop-shadow-lg italic text-white pr-1">
                ROOFTOP FLOW SESSION
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {/* Dash removed as requested */}
                <span className="text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 font-bold tracking-[0.3em] uppercase leading-none">
                  Season 1 Awards
                </span>
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            {!isAdmin ? (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/5 hover:border-orange-500/30 backdrop-blur-md shadow-lg"
              >
                <Lock size={12} /> ADMIN
              </Link>
            ) : (
              <Link 
                to="/" 
                className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/5 hover:border-orange-500/30 backdrop-blur-md shadow-lg"
              >
                <Home size={12} /> PUBLIC
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 z-10 relative">
        {children}
      </main>

      <footer className="border-t border-white/5 bg-black/80 backdrop-blur-xl py-12 text-center z-10 relative mt-auto">
        <div className="flex justify-center items-center gap-2 mb-4 opacity-80">
           <Mic2 size={16} className="text-orange-500" />
           <span className="text-zinc-300 brand-font uppercase tracking-widest text-lg text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Rooftop Flow Session</span>
        </div>
        <p className="text-zinc-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} Rooftop Flow Session. Urban culture at highest fidelity.
        </p>
      </footer>
    </div>
  );
};