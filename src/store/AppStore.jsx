// =============================================
//  NETFLIX CONNECT – GLOBAL APP STORE (Context)
// =============================================
import { createContext, useContext, useReducer, useEffect } from 'react';
import {
  MOCK_USERS, MOCK_ROOMS, INITIAL_MESSAGES, SUBSCRIPTIONS,
  SIM_MESSAGES, AI_INSIGHTS, MOCK_MOVIES
} from '../data/mockData';
import { fetchAllContent } from '../services/tmdbApi';

const AppContext = createContext(null);

const INITIAL_STATE = {
  // Auth
  user: null,
  isAuthenticated: false,

  // Navigation
  view: 'auth',       // auth | home | watch | creator | payment | friends | dashboard
  prevView: null,

  // TMDB live content
  tmdbContent: { trending: [], popular: [], tv: [] },
  tmdbLoading: true,
  tmdbError: null,

  // Active content
  activeMovie: null,
  activeRoom: null,

  // Rooms
  rooms: MOCK_ROOMS,
  userRooms: [],

  // Messages
  messages: INITIAL_MESSAGES,
  typingUsers: [],

  // Playback (shared room state)
  playback: {
    isPlaying: false,
    currentTime: 0,
    duration: 7320,   // 2h02m
    lastSyncedBy: null,
  },

  // Personal playback settings
  personalSettings: {
    audio: 'English',
    subtitles: 'Off',
    volume: 80,
  },

  // Friends
  friends: [],
  friendRequests: [],
  onlineFriends: [],

  // Activity feed
  activityFeed: [],

  // System dashboard
  systemStats: {
    activeRooms: 1482,
    usersOnline: 47293,
    messagesPerMin: 3847,
    engagementRate: 78.4,
    activeRoomDelta: '+12',
    usersDelta: '+2.1k',
    msgDelta: '+14%',
    engageDelta: '+5.2%',
  },

  // AI insights
  currentInsight: AI_INSIGHTS[0],
  insightIndex: 0,

  // Notifications / toasts
  toast: null,

  // UI state
  showPaywall: false,
  paywallFeature: null,
  showCreateRoom: false,
  showInviteModal: false,
  showJoinModal: null,

  // Creator dashboard
  creatorStats: {
    liveViewers: 12840,
    messagesPerMin: 892,
    engagementRate: 94.2,
    reactionSpikes: [12, 45, 23, 78, 34, 91, 56, 67, 23, 88],
    topReaction: '🔥',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        view: 'home',
        friends: MOCK_USERS.filter(u => action.payload.friends.includes(u.id)),
        onlineFriends: MOCK_USERS.filter(u => action.payload.friends.includes(u.id)).slice(0, 3),
        personalSettings: action.payload.preferences,
      };
    case 'LOGOUT':
      return { ...INITIAL_STATE };
    case 'SET_VIEW':
      return { ...state, prevView: state.view, view: action.payload };
    case 'SET_MOVIE':
      return { ...state, activeMovie: action.payload };
    case 'SET_ROOM':
      return { ...state, activeRoom: action.payload };
    case 'ADD_MESSAGE': {
      const newMsg = { id: `msg_${Date.now()}`, ...action.payload, timestamp: Date.now() };
      return { ...state, messages: [...state.messages, newMsg] };
    }
    case 'SET_TYPING':
      return { ...state, typingUsers: action.payload };
    case 'SET_PLAYBACK':
      return { ...state, playback: { ...state.playback, ...action.payload } };
    case 'SET_PERSONAL_SETTINGS':
      return { ...state, personalSettings: { ...state.personalSettings, ...action.payload } };
    case 'ADD_ACTIVITY': {
      const feed = [action.payload, ...state.activityFeed].slice(0, 20);
      return { ...state, activityFeed: feed };
    }
    case 'SET_TMDB_CONTENT':
      return {
        ...state,
        tmdbContent: action.payload.content,
        tmdbLoading: false,
        tmdbError: action.payload.error,
      };
    case 'UPDATE_SYSTEM_STATS':
      return { ...state, systemStats: { ...state.systemStats, ...action.payload } };
    case 'UPDATE_CREATOR_STATS':
      return { ...state, creatorStats: { ...state.creatorStats, ...action.payload } };
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    case 'CLEAR_TOAST':
      return { ...state, toast: null };
    case 'SHOW_PAYWALL':
      return { ...state, showPaywall: true, paywallFeature: action.payload };
    case 'HIDE_PAYWALL':
      return { ...state, showPaywall: false, paywallFeature: null };
    case 'UPGRADE_SUBSCRIPTION': {
      const updatedUser = { ...state.user, subscription: action.payload };
      return { ...state, user: updatedUser, showPaywall: false };
    }
    case 'SET_CREATE_ROOM':
      return { ...state, showCreateRoom: action.payload };
    case 'SET_INVITE_MODAL':
      return { ...state, showInviteModal: action.payload };
    case 'SET_JOIN_MODAL':
      return { ...state, showJoinModal: action.payload };
    case 'CREATE_ROOM': {
      const room = action.payload;
      const tmdb = state.tmdbContent;
      const allMovies = [
        ...(tmdb?.trending || []),
        ...(tmdb?.popular || []),
        ...(tmdb?.tv || []),
        ...MOCK_MOVIES,
      ];
      const foundMovie = room._movieObj || allMovies.find(m => m.id === room.movieId) || MOCK_MOVIES[0];
      return {
        ...state,
        rooms: [room, ...state.rooms],
        activeRoom: room,
        activeMovie: foundMovie,
        view: 'watch',
        showCreateRoom: false,
        messages: [],
        playback: { isPlaying: false, currentTime: 0, duration: 7320, lastSyncedBy: state.user?.id },
      };
    }
    case 'JOIN_ROOM': {
      const room = action.payload;
      const tmdb2 = state.tmdbContent;
      const allM = [...(tmdb2?.trending||[]),...(tmdb2?.popular||[]),...(tmdb2?.tv||[]),...MOCK_MOVIES];
      return {
        ...state,
        activeRoom: room,
        activeMovie: allM.find(m => m.id === room.movieId) || MOCK_MOVIES[0],
        view: 'watch',
        showJoinModal: null,
        messages: [...INITIAL_MESSAGES],
      };
    }
    case 'NEXT_INSIGHT':
      return {
        ...state,
        insightIndex: (state.insightIndex + 1) % AI_INSIGHTS.length,
        currentInsight: AI_INSIGHTS[(state.insightIndex + 1) % AI_INSIGHTS.length],
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Fetch TMDB content on mount
  useEffect(() => {
    fetchAllContent().then(({ trending, popular, tv, error }) => {
      dispatch({
        type: 'SET_TMDB_CONTENT',
        payload: { content: { trending, popular, tv }, error },
      });
    });
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3500);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  // Simulate incoming chat messages when in watch mode
  useEffect(() => {
    if (state.view !== 'watch' || !state.activeRoom) return;
    const others = MOCK_USERS.filter(u => u.id !== state.user?.id);

    const interval = setInterval(() => {
      const sender = others[Math.floor(Math.random() * others.length)];
      const text = SIM_MESSAGES[Math.floor(Math.random() * SIM_MESSAGES.length)];
      dispatch({ type: 'ADD_MESSAGE', payload: { userId: sender.id, text } });

      // Typing indicator briefly
      dispatch({ type: 'SET_TYPING', payload: [sender.id] });
      setTimeout(() => dispatch({ type: 'SET_TYPING', payload: [] }), 1500);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [state.view, state.activeRoom, state.user]);

  // Simulate playback ticking
  useEffect(() => {
    if (state.view !== 'watch' || !state.playback.isPlaying) return;
    const interval = setInterval(() => {
      dispatch({
        type: 'SET_PLAYBACK',
        payload: { currentTime: Math.min(state.playback.currentTime + 1, state.playback.duration) },
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.view, state.playback.isPlaying, state.playback.currentTime]);

  // Simulate system stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: 'UPDATE_SYSTEM_STATS',
        payload: {
          activeRooms: Math.floor(1400 + Math.random() * 200),
          usersOnline: Math.floor(45000 + Math.random() * 5000),
          messagesPerMin: Math.floor(3500 + Math.random() * 700),
          engagementRate: parseFloat((75 + Math.random() * 8).toFixed(1)),
        },
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Simulate creator stats
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: 'UPDATE_CREATOR_STATS',
        payload: {
          liveViewers: Math.floor(12000 + Math.random() * 2000),
          messagesPerMin: Math.floor(800 + Math.random() * 200),
          engagementRate: parseFloat((90 + Math.random() * 8).toFixed(1)),
        },
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Rotate AI insights
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'NEXT_INSIGHT' });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Simulate activity feed
  useEffect(() => {
    if (!state.isAuthenticated) return;
    const friends = MOCK_USERS.filter(u => state.user?.friends.includes(u.id));
    const events = [
      (f) => `${f.name} started watching The Last Frequency`,
      (f) => `${f.name} joined a watch room 🎬`,
      (f) => `${f.name} reacted 🔥 in Stellar Minds`,
      (f) => `${f.name} invited you to a watch party`,
      (f) => `${f.name} is now watching Iron District`,
    ];
    const interval = setInterval(() => {
      const f = friends[Math.floor(Math.random() * friends.length)];
      if (!f) return;
      const ev = events[Math.floor(Math.random() * events.length)];
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: { id: Date.now(), text: ev(f), avatar: f.avatar, time: 'Just now' },
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.user]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
