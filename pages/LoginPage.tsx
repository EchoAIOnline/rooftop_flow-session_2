import React, { useState } from 'react';
import { api } from '../services/mockBackend';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/Input';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = await api.login(email, password);
    if (user) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try admin@rooftop.com / password123');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-black/40 border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="flex justify-center mb-8 relative z-10">
          <div className="bg-zinc-900/80 p-5 rounded-2xl border border-white/10 shadow-lg">
            <Lock className="text-orange-500" size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-black text-center mb-2 brand-font uppercase italic text-white relative z-10">Admin Access</h2>
        <p className="text-zinc-500 text-center mb-8 text-sm relative z-10">Secure Gateway</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <Input 
            label="Email" 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 font-black py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.02] shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Enter Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-zinc-600 font-mono border-t border-white/5 pt-4">
          <p>DEMO MODE</p>
          <p>admin@rooftop.com &bull; password123</p>
        </div>
      </div>
    </div>
  );
};