import { VoteSubmission, VoteStats, FraudFlag, AdminUser } from '../types';
import { ARTISTS, CATEGORIES, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '../constants';
import { supabase } from './supabase';

const SESSION_KEY = 'rooftop_admin_session';

// Helper to simulate network delay (optional, but good for UI feedback)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get simulated IP (since we are client side)
const getSimulatedIP = () => {
  let ip = sessionStorage.getItem('simulated_ip');
  if (!ip) {
    ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    sessionStorage.setItem('simulated_ip', ip);
  }
  return ip;
};

export const api = {
  // --- Public API ---

  submitVote: async (voteData: Omit<VoteSubmission, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>): Promise<{ success: boolean; message?: string }> => {
    // Check Duplicate Email
    const { data: existingEmail } = await supabase
      .from('Voters')
      .select('email')
      .eq('email', voteData.voterInfo.email)
      .single();

    if (existingEmail) {
      return { success: false, message: 'This email address has already voted.' };
    }

    // Check Duplicate Phone
    // Note: Phone format might vary, so strict equality check might be insufficient in production
    // but for this implementation we assume consistent formatting or exact match
    const { data: existingPhone } = await supabase
      .from('Voters')
      .select('phone')
      .eq('phone', voteData.voterInfo.phone)
      .single();

    if (existingPhone) {
      return { success: false, message: 'This phone number has already been used.' };
    }

    const ipAddress = getSimulatedIP();
    const userAgent = navigator.userAgent;

    const { error } = await supabase
      .from('Voters')
      .insert([
        {
          fullName: voteData.voterInfo.fullName,
          email: voteData.voterInfo.email,
          phone: voteData.voterInfo.phone,
          bestPerformance: voteData.selections['best_performance'],
          bestStagePresence: voteData.selections['best_stage_presence'],
          crowdFavorite: voteData.selections['crowd_favorite'],
          bestLyricsBars: voteData.selections['best_lyrics_bars'],
          artistOfTheSeason: voteData.selections['artist_of_season'],
          created_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      console.error('Error submitting vote:', error);
      return { success: false, message: 'Failed to submit vote. Please try again.' };
    }

    return { success: true };
  },

  // --- Admin API ---

  login: async (email: string, pass: string): Promise<AdminUser | null> => {
    // 1. Check Demo Credentials (Hardcoded)
    if (email === DEMO_ADMIN_EMAIL && pass === DEMO_ADMIN_PASSWORD) {
      const user = { email, token: 'mock-jwt-token-demo', fullName: 'Demo Admin' };
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }

    // 2. Check Supabase
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .eq('password', pass) // In production, use hashed passwords!
      .single();

    if (error || !data) {
      return null;
    }

    const user = { email: data.email, token: 'mock-jwt-token-12345', fullName: data.fullName };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: async () => {
    localStorage.removeItem(SESSION_KEY);
  },

  checkSession: (): AdminUser | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  getStats: async (): Promise<VoteStats> => {
    const { data: votes, error } = await supabase
      .from('Voters')
      .select('*');

    if (error) {
      console.error('Error fetching stats:', error);
      return { totalVotes: 0, uniqueVoters: 0, votesByCategory: {} };
    }

    const stats: VoteStats = {
      totalVotes: votes.length,
      uniqueVoters: new Set(votes.map((v: any) => v.email)).size,
      votesByCategory: {}
    };

    CATEGORIES.forEach(cat => {
      stats.votesByCategory[cat.id] = {};
      ARTISTS.forEach(art => {
        stats.votesByCategory[cat.id][art.id] = 0;
      });
    });

    votes.forEach((vote: any) => {
      // Map database columns back to category IDs
      const selections: Record<string, string> = {
        'best_performance': vote.bestPerformance,
        'best_stage_presence': vote.bestStagePresence,
        'crowd_favorite': vote.crowdFavorite,
        'best_lyrics_bars': vote.bestLyricsBars,
        'artist_of_season': vote.artistOfTheSeason
      };

      Object.entries(selections).forEach(([catId, artistId]) => {
        if (artistId && stats.votesByCategory[catId] && stats.votesByCategory[catId][artistId] !== undefined) {
          stats.votesByCategory[catId][artistId]++;
        }
      });
    });

    return stats;
  },

  getAllVotes: async (): Promise<VoteSubmission[]> => {
    const { data: votes, error } = await supabase
      .from('Voters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching votes:', error);
      return [];
    }

    return votes.map((v: any) => ({
      id: String(v.id),
      timestamp: v.created_at,
      ipAddress: v.ipAddress || 'N/A',
      userAgent: v.userAgent || 'N/A',
      voterInfo: {
        fullName: v.fullName,
        email: v.email,
        phone: v.phone,
        type: v.type || 'Unknown'
      },
      selections: {
        'best_performance': v.bestPerformance,
        'best_stage_presence': v.bestStagePresence,
        'crowd_favorite': v.crowdFavorite,
        'best_lyrics_bars': v.bestLyricsBars,
        'artist_of_season': v.artistOfTheSeason
      }
    }));
  },

  detectFraud: (votes: VoteSubmission[]): Record<string, FraudFlag[]> => {
    const flags: Record<string, FraudFlag[]> = {};
    const ipCounts: Record<string, number> = {};
    const timeThreshold = 2000; // 2 seconds

    // Sort by time for velocity checks
    const sortedVotes = [...votes].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    sortedVotes.forEach((vote, index) => {
      if (!flags[vote.id]) flags[vote.id] = [];

      // Check IP Duplication
      if (vote.ipAddress) {
        ipCounts[vote.ipAddress] = (ipCounts[vote.ipAddress] || 0) + 1;
        if (ipCounts[vote.ipAddress] > 2) {
          flags[vote.id].push({ voteId: vote.id, reason: 'High volume from single IP', severity: 'medium' });
        }
      }

      // Check Rapid Submission (Velocity)
      if (index > 0) {
        const prev = sortedVotes[index - 1];
        const timeDiff = new Date(vote.timestamp).getTime() - new Date(prev.timestamp).getTime();
        if (timeDiff < timeThreshold && vote.ipAddress === prev.ipAddress) {
           flags[vote.id].push({ voteId: vote.id, reason: 'Suspiciously rapid submission', severity: 'high' });
        }
      }
    });

    return flags;
  },

  // Helper for CSV export
  generateCSV: (votes: VoteSubmission[]) => {
    const headers = ['Vote ID', 'Timestamp', 'Full Name', 'Email', 'Phone', 'Type', 'IP Address', ...CATEGORIES.map(c => c.title)];
    
    const rows = votes.map(v => [
      v.id,
      new Date(v.timestamp).toLocaleString(),
      `"${v.voterInfo.fullName}"`,
      v.voterInfo.email,
      v.voterInfo.phone,
      v.voterInfo.type,
      v.ipAddress,
      ...CATEGORIES.map(c => {
         const artistId = v.selections[c.id];
         const artist = ARTISTS.find(a => a.id === artistId);
         return artist ? `"${artist.name}"` : 'N/A';
      })
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csvContent;
  },

  resetPolls: async () => {
    const { error } = await supabase
      .from('Voters')
      .delete()
      .neq('id', 0); // Delete all rows (id is usually > 0)

    if (error) {
      console.error('Error resetting polls:', error);
      return { success: false };
    }
    return { success: true };
  }
};