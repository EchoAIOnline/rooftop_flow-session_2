import React, { useEffect, useState } from 'react';
import { api } from '../services/mockBackend';
import { useNavigate } from 'react-router-dom';
import { VoteStats, VoteSubmission, FraudFlag } from '../types';
import { ARTISTS, CATEGORIES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Users, Ticket, AlertTriangle, LogOut, RefreshCw, Settings, X, Trash2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<VoteStats | null>(null);
  const [votes, setVotes] = useState<VoteSubmission[]>([]);
  const [fraudFlags, setFraudFlags] = useState<Record<string, FraudFlag[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'database'>('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const user = api.checkSession();
    if (!user) {
      navigate('/admin');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    const [statsData, votesData] = await Promise.all([
      api.getStats(),
      api.getAllVotes()
    ]);
    const flags = api.detectFraud(votesData);
    
    setStats(statsData);
    setVotes(votesData);
    setFraudFlags(flags);
    setLoading(false);
  };

  const handleLogout = async () => {
    await api.logout();
    navigate('/admin');
  };

  const [resetConfirmation, setResetConfirmation] = useState(false);

  const handleResetPolls = async () => {
    if (!resetConfirmation) {
      setResetConfirmation(true);
      return;
    }

    setLoading(true);
    await api.resetPolls();
    await loadData();
    setIsSettingsOpen(false);
    setResetConfirmation(false);
  };

  // Reset confirmation state when modal closes
  useEffect(() => {
    if (!isSettingsOpen) {
      setResetConfirmation(false);
    }
  }, [isSettingsOpen]);

  const handleExport = () => {
    const csv = api.generateCSV(votes);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rooftop-votes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <div className="flex h-[50vh] items-center justify-center"><RefreshCw className="animate-spin text-orange-500" /></div>;

  return (
    <div className="bg-black/60 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 md:p-8 min-h-[80vh] shadow-xl relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl brand-font uppercase italic text-white">Dashboard</h2>
          <p className="text-zinc-500 text-sm">Real-time voting analytics & security monitoring</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadData} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors border border-white/5" title="Refresh Data">
            <RefreshCw size={20} />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors border border-white/5" title="Settings">
            <Settings size={20} />
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-bold transition-colors border border-red-500/20">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings size={20} className="text-orange-500" /> Settings
            </h3>
            
            <div className="space-y-6">
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} /> Danger Zone
                </h4>
                <p className="text-zinc-400 text-sm mb-4">
                  Resetting the poll will permanently delete all votes and analytics data. This action cannot be undone.
                </p>
                <button 
                  onClick={handleResetPolls}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all ${
                    resetConfirmation 
                      ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20'
                  }`}
                >
                  <Trash2 size={16} /> 
                  {resetConfirmation ? 'Click Again to Confirm Reset' : 'Reset Poll Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'overview' ? 'border-orange-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('database')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'database' ? 'border-orange-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          Voter Database
        </button>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="animate-in fade-in duration-300">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Ticket /></div>
                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Total Votes</span>
              </div>
              <p className="text-4xl font-black text-white">{stats.totalVotes}</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400"><Users /></div>
                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Unique Voters</span>
              </div>
              <p className="text-4xl font-black text-white">{stats.uniqueVoters}</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-red-500/10 rounded-lg text-red-400"><AlertTriangle /></div>
                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Flagged Entries</span>
              </div>
              <p className="text-4xl font-black text-white">{Object.keys(fraudFlags).length}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {CATEGORIES.map(cat => {
              const data = ARTISTS.map(artist => ({
                name: artist.name,
                votes: stats.votesByCategory[cat.id][artist.id] || 0
              })).sort((a,b) => b.votes - a.votes);

              return (
                <div key={cat.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl shadow-sm backdrop-blur-sm">
                  <h3 className="text-lg font-bold mb-6 text-zinc-300 uppercase tracking-wide">{cat.title}</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{fill: '#a1a1aa', fontSize: 10, fontWeight: 600}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                          cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={20}>
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#f97316' : '#52525b'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Voter Records</h3>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-green-900/20"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 text-zinc-400 uppercase text-xs font-bold border-b border-white/10">
                  <tr>
                    <th className="p-4">Time</th>
                    <th className="p-4">Voter Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {votes.map(vote => {
                    const flags = fraudFlags[vote.id];
                    return (
                      <tr key={vote.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 whitespace-nowrap text-zinc-500">
                          {new Date(vote.timestamp).toLocaleDateString()} <span className="text-xs opacity-50">{new Date(vote.timestamp).toLocaleTimeString()}</span>
                        </td>
                        <td className="p-4 font-medium text-white">{vote.voterInfo.fullName}</td>
                        <td className="p-4 text-zinc-400">{vote.voterInfo.email}</td>
                        <td className="p-4 text-zinc-400">
                          {vote.voterInfo.phone}
                        </td>
                        <td className="p-4">
                          {flags ? (
                            <div className="flex flex-col gap-1">
                              {flags.map((f, i) => (
                                <span key={i} className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded">
                                  <AlertTriangle size={10} /> {f.reason}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-green-500 text-xs bg-green-900/20 px-2 py-1 rounded">Verified</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {votes.length === 0 && <div className="p-8 text-center text-zinc-500">No votes recorded yet.</div>}
          </div>
        </div>
      )}
    </div>
  );
};