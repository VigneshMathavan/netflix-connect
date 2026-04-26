// =============================================
//  TMDB API SERVICE
// =============================================

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '4f4bf3e4f8ea92ce4b540f8ee8ad2bae'; // Fallback to demo key if not set
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

const FALLBACK_POSTER = 'https://picsum.photos/seed/fallback/500/750';
const FALLBACK_BACKDROP = 'https://picsum.photos/seed/fallbackb/1280/720';

function normalizeMovie(item, index) {
  const isTV = item.media_type === 'tv' || item.name !== undefined;
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '2024').split('-')[0];
  const poster = item.poster_path ? `${IMG_BASE}${item.poster_path}` : `${FALLBACK_POSTER}${index}`;
  const backdrop = item.backdrop_path ? `${BACKDROP_BASE}${item.backdrop_path}` : `${FALLBACK_BACKDROP}${index}`;

  return {
    id: `tmdb_${item.id}`,
    tmdbId: item.id,
    title,
    year,
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
    thumbnail: poster,
    backdrop,
    description: item.overview || '',
    genre: [],          // filled later if needed
    duration: isTV ? 'TV Series' : 'Feature Film',
    maturity: 'TV-MA',
    isTV,
    // friend social overlay (simulated)
    friendsWatched: Math.floor(Math.random() * 6),
    friendWatchingNow: Math.random() > 0.6 ? null : ['Jamie', 'Sam', 'Priya', 'Jordan'][Math.floor(Math.random() * 4)],
  };
}

const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

async function fetchTMDB(endpoint, params = {}) {
  const qs = new URLSearchParams({ 
    language: 'en-US', 
    ...params,
    // Add api_key only if no access token is provided (fallback)
    ...(TMDB_ACCESS_TOKEN ? {} : { api_key: TMDB_API_KEY })
  }).toString();

  const headers = {
    'Content-Type': 'application/json'
  };

  if (TMDB_ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${TMDB_ACCESS_TOKEN}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}?${qs}`, { headers });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(`TMDB ${res.status}: ${errData.status_message || 'Unauthorized'}`);
  }
  return res.json();
}

export async function fetchTrendingMovies() {
  const data = await fetchTMDB('/trending/movie/week');
  return (data.results || []).slice(0, 12).map((m, i) => ({
    ...normalizeMovie(m, i),
    tags: ['Trending'],
  }));
}

export async function fetchPopularMovies() {
  const data = await fetchTMDB('/movie/popular');
  return (data.results || []).slice(0, 12).map((m, i) => ({
    ...normalizeMovie(m, i),
    tags: ['Recommended'],
  }));
}

export async function fetchTVShows() {
  const data = await fetchTMDB('/tv/popular');
  return (data.results || []).slice(0, 12).map((m, i) => ({
    ...normalizeMovie(m, i),
    tags: ['Watch with Friends'],
  }));
}

export async function fetchAllContent() {
  try {
    const [trending, popular, tv] = await Promise.all([
      fetchTrendingMovies(),
      fetchPopularMovies(),
      fetchTVShows(),
    ]);
    return { trending, popular, tv, error: null };
  } catch (err) {
    console.error('TMDB fetch failed:', err);
    return { trending: [], popular: [], tv: [], error: err.message };
  }
}
