import React, { useState } from 'react';
import { ARTISTS, CATEGORIES, VOTER_TYPES } from '../constants';
import { VoterInfo, VoterType } from '../types';
import { Input } from '../components/ui/Input';
import { api } from '../services/mockBackend';
import { CheckCircle, AlertCircle, Loader2, Music, User, Trophy, Mic, Sparkles, Star } from 'lucide-react';

export const VotingPage: React.FC = () => {
  const [step, setStep] = useState<'info' | 'voting' | 'confirm' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [voterInfo, setVoterInfo] = useState<VoterInfo>({
    fullName: '',
    email: '',
    phone: '',
    type: VoterType.SUPPORTING
  });

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // --- Handlers ---

  const validateInfo = () => {
    const errors: Record<string, string> = {};
    if (!voterInfo.fullName.trim()) errors.fullName = "Full name is required";
    if (!voterInfo.email.trim() || !/\S+@\S+\.\S+/.test(voterInfo.email)) errors.email = "Valid email is required";
    if (!voterInfo.phone.trim() || voterInfo.phone.length < 10) errors.phone = "Valid phone number is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInfo()) {
      setStep('voting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleVoteSelection = (categoryId: string, artistId: string) => {
    setSelections(prev => ({ ...prev, [categoryId]: artistId }));
  };

  const isVotingComplete = () => {
    return CATEGORIES.every(cat => !!selections[cat.id]);
  };

  const handleSubmit = async () => {
    if (!isVotingComplete()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await api.submitVote({
        voterInfo,
        selections
      });

      if (result.success) {
        setStep('success');
      } else {
        setError(result.message || 'Submission failed');
        setStep('info'); // Go back to fix info if duplicate
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Renders ---

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-6 bg-zinc-900/60 backdrop-blur-2xl rounded-[2rem] border border-orange-500/20 shadow-[0_0_80px_rgba(234,88,12,0.15)] relative overflow-hidden mt-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
        
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-8 shadow-[0_0_30px_rgba(234,88,12,0.4)] animate-bounce relative">
          <div className="absolute inset-0 rounded-full border border-white/20"></div>
          <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-4xl md:text-5xl brand-font mb-6 text-white uppercase italic drop-shadow-md">Vote Recorded!</h2>
        <p className="text-zinc-300 mb-10 text-lg max-w-md mx-auto leading-relaxed font-light">
          Your voice has been heard on the rooftop. Thank you for supporting the movement and the artists.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-white/10 hover:bg-white/20 text-white font-black py-4 px-10 rounded-xl transition-all hover:scale-105 border border-white/10 hover:border-white/30 uppercase tracking-wide backdrop-blur-md"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Intro Hero */}
      <div className="text-center mb-12 pt-4">
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] mb-10 backdrop-blur-xl shadow-lg">
          <Sparkles size={12} className="text-orange-500" /> Official Voting Portal
        </div>

        {/* Manifesto Section */}
        <div className="max-w-5xl mx-auto mb-16 px-4 relative">
           {/* Decorative lines */}
           <div className="hidden md:block absolute top-1/2 left-0 w-24 h-[1px] bg-gradient-to-r from-transparent to-white/20"></div>
           <div className="hidden md:block absolute top-1/2 right-0 w-24 h-[1px] bg-gradient-to-l from-transparent to-white/20"></div>

           <h3 className="text-4xl md:text-7xl font-black uppercase italic brand-font mb-10 text-white leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
             Where Urban Culture Finds Its <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 drop-shadow-sm pr-2 pb-1 inline-block">Highest Fidelity</span>
           </h3>
           
           <div className="relative overflow-hidden group p-8 md:p-12 rounded-3xl text-left mx-auto max-w-4xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0"></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <Star className="text-orange-500 w-8 h-8 fill-orange-500/20" />
                </div>
                <div>
                  <p className="text-zinc-100 text-xl md:text-2xl font-medium leading-relaxed mb-6 font-serif tracking-wide">
                    "The raw energy of a live show. The precision of a studio session. The soul of the city."
                  </p>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans max-w-2xl">
                    Rooftop Flow Session provides a minimalist, high-end stage for the next generation of tastemakers. By blending cinematic urban aesthetics with studio-grade live audio, we create more than just a performance video; we create a cultural artifact.
                  </p>
                </div>
              </div>
           </div>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className={`h-1 rounded-full w-16 transition-all duration-500 ${step === 'info' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`} />
          <div className={`h-1 rounded-full w-16 transition-all duration-500 ${step === 'voting' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`} />
          <div className={`h-1 rounded-full w-16 transition-all duration-500 ${step === 'confirm' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`} />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-200 p-4 rounded-xl mb-8 flex items-center gap-3 backdrop-blur-md max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="text-red-500" />
          {error}
        </div>
      )}

      {step === 'info' && (
        <form onSubmit={handleInfoSubmit} className="max-w-3xl mx-auto bg-zinc-900/60 backdrop-blur-2xl border border-white/5 p-6 md:p-12 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
          
          <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-red-700 text-white flex items-center justify-center shadow-lg shadow-orange-900/30 border border-white/10">
              <User size={32} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-3xl font-black brand-font uppercase italic text-white drop-shadow-sm">Voter Access</h3>
              <p className="text-zinc-400 text-sm mt-1 font-medium tracking-wide">Enter your credentials to unlock the ballot</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8 relative z-10">
            <Input 
              label="Full Name" 
              placeholder="e.g. Jordan Smith"
              value={voterInfo.fullName}
              onChange={e => setVoterInfo({...voterInfo, fullName: e.target.value})}
              error={validationErrors.fullName}
            />
            <Input 
              label="Email Address" 
              type="email"
              placeholder="name@example.com"
              value={voterInfo.email}
              onChange={e => setVoterInfo({...voterInfo, email: e.target.value})}
              error={validationErrors.email}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12 relative z-10">
            <Input 
              label="Phone Number" 
              type="tel"
              placeholder="(555) 123-4567"
              value={voterInfo.phone}
              onChange={e => setVoterInfo({...voterInfo, phone: e.target.value})}
              error={validationErrors.phone}
            />
            <div className="flex flex-col gap-2 group">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider text-[11px] group-focus-within:text-orange-400 transition-colors">
                I am... <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-zinc-900/40 border border-white/5 focus:border-orange-500/50 rounded-xl p-4 text-white outline-none appearance-none hover:border-white/10 transition-colors cursor-pointer backdrop-blur-md shadow-inner"
                  value={voterInfo.type}
                  onChange={e => setVoterInfo({...voterInfo, type: e.target.value as VoterType})}
                >
                  {VOTER_TYPES.map(t => (
                    <option key={t.value} value={t.value} className="bg-zinc-900 text-zinc-300">{t.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-white/5 relative z-10">
            <button 
              type="submit"
              className="bg-white text-black hover:bg-orange-500 hover:text-white font-black py-4 px-12 rounded-xl transition-all w-full md:w-auto uppercase tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Voting
            </button>
          </div>
        </form>
      )}

      {step === 'voting' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="flex items-center justify-between mb-8 px-4 md:px-0">
            <h3 className="text-3xl font-black brand-font uppercase italic flex items-center gap-3 text-white drop-shadow-lg">
               <span className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg not-italic shadow-[0_0_15px_rgba(249,115,22,0.6)]">2</span> 
               Select Your Winners
            </h3>
            <div className="hidden md:block text-xs font-bold uppercase tracking-widest text-zinc-300 bg-black/40 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
              {Object.keys(selections).length} / {CATEGORIES.length} Categories
            </div>
          </div>

          <div className="space-y-12">
            {CATEGORIES.map((category, index) => (
              <div key={category.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[2.2rem] opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                
                <div className="relative bg-zinc-900/60 border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-xl backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row md:items-center gap-5 mb-8 border-b border-white/5 pb-6">
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-3.5 rounded-2xl text-orange-500 border border-white/5 shadow-inner">
                      {index === 0 ? <Mic size={24} /> : 
                       index === CATEGORIES.length - 1 ? <Trophy size={24} /> : 
                       <Music size={24} />}
                    </div>
                    <div>
                      <h4 className="text-2xl md:text-3xl font-black brand-font uppercase tracking-wide italic text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">{category.title}</h4>
                      <p className="text-zinc-400 text-sm font-medium tracking-wide">Select one artist for this category</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {ARTISTS.map((artist) => {
                      const isSelected = selections[category.id] === artist.id;
                      return (
                        <label 
                          key={artist.id}
                          className={`cursor-pointer group/card relative flex flex-col p-2.5 rounded-2xl border transition-all duration-300 overflow-hidden
                          ${isSelected 
                            ? 'bg-orange-500/20 border-orange-500/50 shadow-[0_0_20px_rgba(234,88,12,0.15)]' 
                            : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1'}`}
                        >
                          <input 
                            type="radio" 
                            name={category.id} 
                            className="hidden" 
                            value={artist.id}
                            onChange={() => handleVoteSelection(category.id, artist.id)}
                          />
                          
                          <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-black shadow-inner">
                            {artist.image ? (
                              <img 
                                src={artist.image} 
                                alt={artist.name} 
                                referrerPolicy="no-referrer"
                                className={`w-full h-full object-cover transition-transform duration-700 ease-out
                                  ${isSelected ? 'scale-110 saturate-110' : 'group-hover/card:scale-110 saturate-[0.6] group-hover/card:saturate-100 opacity-80 group-hover/card:opacity-100'}`} 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                                <User size={40} />
                              </div>
                            )}
                            
                            {/* Selection Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-orange-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`} />

                            {isSelected && (
                               <div className="absolute top-2 right-2 bg-orange-500 text-white p-1.5 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.8)] animate-in zoom-in duration-300">
                                 <CheckCircle size={14} strokeWidth={4} />
                               </div>
                            )}
                          </div>
                          
                          <div className="mt-auto px-2 pb-1 relative z-10">
                            <span className={`block font-black uppercase tracking-tight leading-none text-lg transition-colors brand-font italic drop-shadow-md ${isSelected ? 'text-white' : 'text-zinc-400 group-hover/card:text-zinc-200'}`}>
                              {artist.name}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-6 mt-16 z-40 animate-in slide-in-from-bottom-10 duration-500 px-4 md:px-0">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-2xl -z-10 shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10" />
             <div className="p-4 rounded-2xl flex justify-between items-center">
              <div className="text-sm font-bold text-zinc-500 hidden md:block pl-4">
                <span className="text-white text-base">{Object.keys(selections).length}</span> <span className="text-xs">/ {CATEGORIES.length} SELECTED</span>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setStep('info')}
                  className="flex-1 md:flex-none px-6 py-3.5 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all uppercase text-xs tracking-wider"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep('confirm')}
                  disabled={!isVotingComplete()}
                  className={`flex-1 md:flex-none px-8 py-3.5 rounded-xl font-black uppercase tracking-wider text-sm transition-all shadow-lg
                    ${isVotingComplete() 
                      ? 'bg-white text-black hover:bg-orange-500 hover:text-white hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]' 
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5'}`}
                >
                  Review Ballot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'confirm' && (
         <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-6 md:p-12 rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500"></div>
           
           <h3 className="text-3xl font-black mb-8 text-center uppercase italic text-white drop-shadow-md">Confirm Your Ballot</h3>
           
           <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-inner">
              <div>
                <h4 className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] mb-1">Voter Registration</h4>
                <span className="block text-2xl font-bold text-white mb-1">{voterInfo.fullName}</span>
                <span className="text-zinc-400 text-sm">{voterInfo.email}</span>
              </div>
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 text-xs font-bold text-orange-400 uppercase tracking-wider shadow-lg">
                {voterInfo.type}
              </div>
           </div>

           <div className="space-y-3 mb-12">
              <h4 className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] mb-2 px-2">Your Selections</h4>
              {CATEGORIES.map(cat => {
                const artist = ARTISTS.find(a => a.id === selections[cat.id]);
                return (
                  <div key={cat.id} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-colors group shadow-md hover:bg-white/10">
                    <span className="text-zinc-400 text-xs md:text-sm font-bold uppercase tracking-wide pl-2">{cat.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-100 font-black uppercase italic group-hover:text-orange-400 transition-colors brand-font text-lg shadow-black drop-shadow-sm">{artist?.name}</span>
                      {artist?.image && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-sm">
                          <img 
                            src={artist.image} 
                            alt={artist.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
           </div>

           <div className="flex flex-col gap-4">
             <button 
               onClick={handleSubmit}
               disabled={loading}
               className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-lg flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-[1.01] transition-all"
             >
               {loading ? <Loader2 className="animate-spin" /> : <>Confirm & Submit <CheckCircle size={20} /></>}
             </button>
             <button 
               onClick={() => setStep('voting')}
               className="w-full bg-transparent text-zinc-500 hover:text-white font-bold py-3 text-sm uppercase tracking-wider transition-colors"
             >
               Go Back & Change
             </button>
           </div>
         </div>
      )}
    </div>
  );
};