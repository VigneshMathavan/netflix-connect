// =============================================
//  NETFLIX CONNECT - MOCK DATABASE & APP STATE
// =============================================

export const MOCK_USERS = [
  {
    id: 'u1', name: 'Alex Morgan', email: 'alex@example.com', password: 'demo123',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Alex',
    subscription: 'premium', joinedAt: '2023-01-15',
    friends: ['u2', 'u3', 'u4', 'u5'],
    watchHistory: ['m1', 'm3', 'm5'],
    preferences: { audio: 'English', subtitles: 'Off', volume: 80 },
  },
  {
    id: 'u2', name: 'Jamie Lee', email: 'jamie@example.com', password: 'demo123',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Jamie',
    subscription: 'standard', joinedAt: '2023-03-22',
    friends: ['u1', 'u3'],
    watchHistory: ['m2', 'm4'],
    preferences: { audio: 'Spanish', subtitles: 'English', volume: 65 },
  },
  {
    id: 'u3', name: 'Sam Chen', email: 'sam@example.com', password: 'demo123',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sam',
    subscription: 'premium_plus', joinedAt: '2022-11-08',
    friends: ['u1', 'u2', 'u4'],
    watchHistory: ['m1', 'm2', 'm6'],
    preferences: { audio: 'Korean', subtitles: 'English', volume: 75 },
  },
  {
    id: 'u4', name: 'Priya Kapoor', email: 'priya@example.com', password: 'demo123',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Priya',
    subscription: 'basic', joinedAt: '2024-01-01',
    friends: ['u1', 'u3'],
    watchHistory: ['m3'],
    preferences: { audio: 'Hindi', subtitles: 'English', volume: 90 },
  },
  {
    id: 'u5', name: 'Jordan Blake', email: 'jordan@example.com', password: 'demo123',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Jordan',
    subscription: 'premium', joinedAt: '2023-07-14',
    friends: ['u1'],
    watchHistory: ['m5', 'm6'],
    preferences: { audio: 'French', subtitles: 'Off', volume: 70 },
  },
];

export const MOCK_MOVIES = [
  {
    id: 'm1', title: 'Echoes of the Abyss', genre: ['Thriller', 'Sci-Fi'], rating: 8.4,
    year: 2024, duration: '2h 14m', maturity: 'TV-MA',
    description: 'A deep-space crew discovers a signal that rewrites the laws of physics and their own reality.',
    thumbnail: 'https://picsum.photos/seed/movie1/400/220',
    backdrop: 'https://picsum.photos/seed/movie1b/1280/720',
    tags: ['Trending', 'Watch with Friends'],
    activeRooms: 12,
  },
  {
    id: 'm2', title: 'Neon Carnival', genre: ['Comedy', 'Drama'], rating: 7.9,
    year: 2024, duration: '1h 52m', maturity: 'TV-14',
    description: 'Three strangers reunite at their hometown carnival with secrets that could change everything.',
    thumbnail: 'https://picsum.photos/seed/movie2/400/220',
    backdrop: 'https://picsum.photos/seed/movie2b/1280/720',
    tags: ['Trending', 'Recommended'],
    activeRooms: 8,
  },
  {
    id: 'm3', title: 'The Last Frequency', genre: ['Mystery', 'Thriller'], rating: 9.1,
    year: 2024, duration: '2h 38m', maturity: 'TV-MA',
    description: 'A radio operator intercepts a signal from the future and must decide what truth is worth fighting for.',
    thumbnail: 'https://picsum.photos/seed/movie3/400/220',
    backdrop: 'https://picsum.photos/seed/movie3b/1280/720',
    tags: ['Top Rated', 'Recommended'],
    activeRooms: 21,
  },
  {
    id: 'm4', title: 'Summer in Osaka', genre: ['Romance', 'Drama'], rating: 8.0,
    year: 2023, duration: '1h 44m', maturity: 'TV-PG',
    description: 'Two artists cross paths in Japan and discover love is more than language.',
    thumbnail: 'https://picsum.photos/seed/movie4/400/220',
    backdrop: 'https://picsum.photos/seed/movie4b/1280/720',
    tags: ['Recommended', 'Watch with Friends'],
    activeRooms: 5,
  },
  {
    id: 'm5', title: 'Iron District', genre: ['Action', 'Crime'], rating: 8.7,
    year: 2024, duration: '2h 02m', maturity: 'TV-MA',
    description: 'An undercover detective infiltrates a criminal empire and loses herself in the process.',
    thumbnail: 'https://picsum.photos/seed/movie5/400/220',
    backdrop: 'https://picsum.photos/seed/movie5b/1280/720',
    tags: ['Trending', 'Top Rated'],
    activeRooms: 17,
  },
  {
    id: 'm6', title: 'Stellar Minds', genre: ['Documentary', 'Science'], rating: 9.3,
    year: 2024, duration: '1h 30m', maturity: 'TV-G',
    description: 'A breathtaking journey through the frontiers of human discovery and the cosmos.',
    thumbnail: 'https://picsum.photos/seed/movie6/400/220',
    backdrop: 'https://picsum.photos/seed/movie6b/1280/720',
    tags: ['Live Events', 'Top Rated'],
    activeRooms: 34,
  },
  {
    id: 'm7', title: 'Blood and Ivory', genre: ['Historical', 'Drama'], rating: 8.2,
    year: 2023, duration: '3h 08m', maturity: 'TV-MA',
    description: 'A tale of empire, art and betrayal across Renaissance Europe.',
    thumbnail: 'https://picsum.photos/seed/movie7/400/220',
    backdrop: 'https://picsum.photos/seed/movie7b/1280/720',
    tags: ['Recommended'],
    activeRooms: 3,
  },
  {
    id: 'm8', title: 'Circuit Breaker', genre: ['Tech Thriller', 'Action'], rating: 7.8,
    year: 2024, duration: '1h 58m', maturity: 'TV-14',
    description: 'A hacker-turned-hero races to stop a global blackout triggered by an AI gone rogue.',
    thumbnail: 'https://picsum.photos/seed/movie8/400/220',
    backdrop: 'https://picsum.photos/seed/movie8b/1280/720',
    tags: ['Trending', 'Watch with Friends'],
    activeRooms: 9,
  },
];

export const MOCK_ROOMS = [
  {
    id: 'r1', movieId: 'm3', hostId: 'u3', name: "Sam's Mystery Night",
    isPrivate: true, participants: ['u3', 'u1', 'u5'],
    playbackTime: 2340, isPlaying: true, createdAt: Date.now() - 3600000,
    chatCount: 142, reactionCount: 87,
  },
  {
    id: 'r2', movieId: 'm5', hostId: 'u2', name: "Jamie's Action Watch",
    isPrivate: true, participants: ['u2', 'u4'],
    playbackTime: 1820, isPlaying: true, createdAt: Date.now() - 1800000,
    chatCount: 98, reactionCount: 55,
  },
];

// Official public events — the ONLY exception to private rooms
export const OFFICIAL_EVENTS = [
  {
    id: 'ev1', movieId: 'm6', hostId: 'c1', name: 'Stellar Minds — Live World Premiere',
    isPrivate: false, isOfficialEvent: true, eventType: 'Live Premiere',
    participants: ['u1', 'u2', 'u3', 'u4', 'u5'],
    playbackTime: 0, isPlaying: false, createdAt: Date.now() - 300000,
    chatCount: 1842, reactionCount: 3120, isLive: true,
    hostName: 'Netflix', hostAvatar: 'https://api.dicebear.com/8.x/initials/svg?seed=NF&backgroundColor=e50914',
  },
  {
    id: 'ev2', movieId: 'm5', hostId: 'c2', name: 'Elena Vasquez Live Q&A — Iron District',
    isPrivate: false, isOfficialEvent: true, eventType: 'Actor Q&A',
    participants: ['u1', 'u3'],
    playbackTime: 0, isPlaying: false, createdAt: Date.now() - 600000,
    chatCount: 924, reactionCount: 1200, isLive: true,
    hostName: 'Elena Vasquez', hostAvatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Elena',
  },
];

// Simulated friend watch history per movie (keyed by mock movie id)
export const FRIEND_WATCH_HISTORY = {
  m1: ['Jamie Lee', 'Sam Chen'],
  m2: ['Sam Chen'],
  m3: ['Jamie Lee', 'Priya Kapoor', 'Jordan Blake'],
  m4: ['Priya Kapoor'],
  m5: ['Jordan Blake', 'Jamie Lee'],
  m6: ['Sam Chen', 'Jordan Blake', 'Jamie Lee'],
  m7: [],
  m8: ['Sam Chen'],
};

export const MOCK_CREATORS = [
  {
    id: 'c1', name: 'Apex Studios', type: 'studio', tier: 'creator_pro',
    avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=AS&backgroundColor=e50914',
    followers: 482000, activeRoom: 'r3', verified: true,
    description: 'Award-winning studio behind Stellar Minds and Echoes of the Abyss.',
    upcomingEvents: ['Live Q&A - May 3', "Director's Cut Screening - May 10"],
  },
  {
    id: 'c2', name: 'Elena Vasquez', type: 'actor', tier: 'creator_plus',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Elena',
    followers: 1200000, activeRoom: null, verified: true,
    description: 'Lead actress in Iron District. Fan Q&A every Thursday.',
    upcomingEvents: ['Fan Q&A - Apr 28'],
  },
  {
    id: 'c3', name: 'Marcus Webb', type: 'director', tier: 'creator_enterprise',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Marcus',
    followers: 890000, activeRoom: 'r1', verified: true,
    description: 'Director of The Last Frequency. Watch with the director sessions.',
    upcomingEvents: ['Watch with Director - May 1'],
  },
];

export const SUBSCRIPTIONS = {
  basic: {
    id: 'basic', name: 'Basic', price: 6.99, color: '#666',
    features: ['HD quality', '1 screen', 'No Connect access'],
    connectFeatures: [],
    canJoinRooms: false, canCreateRooms: false, canInvite: false,
    chatLimit: 0, roomLimit: 0,
  },
  standard: {
    id: 'standard', name: 'Standard', price: 13.99, color: '#4285F4',
    features: ['Full HD', '2 screens', 'Join watch rooms', 'Basic chat'],
    connectFeatures: ['Join public rooms', 'Basic chat (100 msg/day)'],
    canJoinRooms: true, canCreateRooms: false, canInvite: false,
    chatLimit: 100, roomLimit: 0,
  },
  premium: {
    id: 'premium', name: 'Premium', price: 19.99, color: '#E50914',
    features: ['4K Ultra HD', '4 screens', 'Create rooms', 'Invite friends', 'Full chat'],
    connectFeatures: ['Create watch rooms', 'Invite friends', 'Unlimited chat', 'Reactions'],
    canJoinRooms: true, canCreateRooms: true, canInvite: true,
    chatLimit: -1, roomLimit: 5,
  },
  premium_plus: {
    id: 'premium_plus', name: 'Premium+', price: 29.99, color: '#F5C518',
    features: ['4K+HDR', 'Dolby Atmos', 'Unlimited screens', 'Creator features', 'AI insights'],
    connectFeatures: ['Everything in Premium', 'Community features', 'Advanced AI insights', 'Creator access', 'Priority matching'],
    canJoinRooms: true, canCreateRooms: true, canInvite: true,
    chatLimit: -1, roomLimit: -1, hasCreatorAccess: true, hasAIInsights: true,
  },
};

export const INITIAL_MESSAGES = [
  { id: 'msg1', userId: 'u3', text: 'This movie is incredible', timestamp: Date.now() - 120000 },
  { id: 'msg2', userId: 'u5', text: "I can't believe that last scene!", timestamp: Date.now() - 90000 },
  { id: 'msg3', userId: 'u1', text: 'The cinematography is stunning', timestamp: Date.now() - 60000 },
  { id: 'msg4', userId: 'u2', text: 'Anyone else think the director is genius?', timestamp: Date.now() - 45000 },
  { id: 'msg5', userId: 'u4', text: 'That ending was very moving', timestamp: Date.now() - 30000 },
];

export const SIM_MESSAGES = [
  "This scene is incredible",
  "Wait what just happened??",
  "Called it from the beginning",
  "The soundtrack is exceptional",
  "That was very emotional",
  "Excellent quality",
  "This is why Netflix is the standard",
  "Pause! Did anyone catch that detail?",
  "The plot twist was unexpected",
  "Rewatching this immediately after",
  "The acting is on another level",
  "Director really delivered here",
  "Stream is perfect, no lag at all",
  "The visuals are stunning",
  "First time watching, already impressed",
];

export const EMOJIS = ['❤️', '😂', '😮', '😭', '🔥', '👏', '🤯', '💀', '✨', '👀', '🎬', '⭐'];
export const REACTIONS = ['❤️', '😂', '😮', '😭', '🔥', '👏', '🤯'];

export const AI_INSIGHTS = [
  { type: 'engagement', text: 'Engagement spiking! 3x normal activity in this room.', icon: 'TREND' },
  { type: 'trending', text: 'This content is trending among your friends.', icon: 'HOT' },
  { type: 'retention', text: 'High retention probability - 92% watch completion predicted.', icon: 'AIM' },
  { type: 'community', text: 'Peak watch party hours for this title: 8-10 PM.', icon: 'TIME' },
  { type: 'prediction', text: 'Expected engagement spike in the next 8 minutes.', icon: 'NEXT' },
  { type: 'social', text: '4 of your friends watched this in the last 24 hours.', icon: 'SOCIAL' },
  { type: 'milestone', text: 'This room is in the top 1% most active globally.', icon: 'RANK' },
  { type: 'mood', text: 'Mood analysis: Room energy is HIGH. Reactions surging.', icon: 'LIVE' },
];
