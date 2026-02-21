export enum VoterType {
  ATTENDING = 'Attending the award show',
  SUPPORTING = 'Supporting online',
  ARTIST_TEAM = 'Artist / Team member'
}

export interface Artist {
  id: string;
  name: string;
  image?: string; // Optional URL for artist image
}

export interface Category {
  id: string;
  title: string;
}

export interface VoterInfo {
  fullName: string;
  email: string;
  phone: string;
  type: VoterType;
}

export interface VoteSubmission {
  id: string;
  voterInfo: VoterInfo;
  selections: Record<string, string>; // categoryId -> artistId
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface VoteStats {
  totalVotes: number;
  uniqueVoters: number;
  votesByCategory: Record<string, Record<string, number>>; // categoryId -> artistId -> count
}

export interface FraudFlag {
  voteId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AdminUser {
  email: string;
  token: string;
}