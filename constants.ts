import { Artist, Category, VoterType } from './types';

export const ARTISTS: Artist[] = [
  { 
    id: 'og_kane', 
    name: 'OG Kane',
    image: 'https://drive.google.com/thumbnail?id=1AahnQwr8e0MvRf4OwHkXXYt4RG2gRyQ4&sz=w1000'
  },
  { 
    id: 'burn_ice', 
    name: 'Burn Ice',
    image: 'https://drive.google.com/thumbnail?id=1wHdpQr6QXzC5SjA7Fi8UEjtiyCorz-6G&sz=w1000'
  },
  { 
    id: 'king_enjel', 
    name: 'King Enjel',
    image: 'https://drive.google.com/thumbnail?id=1ERa98tlgiZCVajyiSX_8p6t2Ilc5YMp4&sz=w1000'
  },
  { 
    id: 'freeup', 
    name: 'FreeUp',
    image: 'https://drive.google.com/thumbnail?id=1o9B2olRNiPV3JH9odYRktm9N4HKZEn5L&sz=w1000'
  },
  { 
    id: 'izzy_lyrics', 
    name: 'Izzy Lyrics',
    image: 'https://drive.google.com/thumbnail?id=179CNiXc_6AOBA88TZaRUDNpWr8LUhKze&sz=w1000'
  },
  { 
    id: 'trae_reed', 
    name: 'Trae Reed',
    image: 'https://drive.google.com/thumbnail?id=1Dy62HM4r-4udqGSSRtmXXivmH-h_P2Az&sz=w1000'
  },
  { 
    id: 'wolf', 
    name: 'Wolf',
    image: 'https://drive.google.com/thumbnail?id=185Ehdubsgd5wJMnsQ6SokU6Si5IyYzYI&sz=w1000'
  },
  { 
    id: 'yulla', 
    name: 'Yulla',
    image: 'https://drive.google.com/thumbnail?id=1CMeTBiGInj0M8MI0HrBv65oCjDzsuyxD&sz=w1000'
  },
  { 
    id: 'ru_dapaperboy', 
    name: 'RU DaPaperBoy',
    image: 'https://drive.google.com/thumbnail?id=12JfYPHJ125IuU4s2BoGXC2xan3yvKLgf&sz=w1000'
  },
  { 
    id: 'darel_jr', 
    name: "DA'REL J.R.",
    image: 'https://drive.google.com/thumbnail?id=1wYCVqfOps331vsAPANWOEzpSjsSFGqCM&sz=w1000'
  },
  { 
    id: 'ace_lee', 
    name: 'AceLee',
    image: 'https://drive.google.com/thumbnail?id=1R1_optKPo1ZBa1rZFqDq52jcizLcup9w&sz=w1000'
  },
  { 
    id: 'stonie500', 
    name: 'Stonie500',
    image: 'https://drive.google.com/thumbnail?id=1p9_KhlQrfqFUJqFms2Wqkic6Qxo9fYxz&sz=w1000'
  },
];

export const CATEGORIES: Category[] = [
  { id: 'best_performance', title: 'Best Performance' },
  { id: 'best_stage_presence', title: 'Best Stage Presence' },
  { id: 'crowd_favorite', title: 'Crowd Favorite' },
  { id: 'best_lyrics_bars', title: 'Best Lyrics & Bars' },
  { id: 'artist_of_season', title: 'Artist of the Season' },
];

export const VOTER_TYPES = [
  { value: VoterType.ATTENDING, label: 'Attending the award show' },
  { value: VoterType.SUPPORTING, label: 'Supporting online' },
  { value: VoterType.ARTIST_TEAM, label: 'Artist / Team member' },
];

// In a real app, these would be server-side env vars
export const DEMO_ADMIN_EMAIL = "admin@rooftop.com";
export const DEMO_ADMIN_PASSWORD = "password123";