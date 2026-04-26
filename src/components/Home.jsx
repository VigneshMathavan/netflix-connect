// =============================================
//  HOME / DISCOVERY SCREEN  —  friends-first, TMDB-powered
// =============================================
import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { MOCK_MOVIES, MOCK_USERS, OFFICIAL_EVENTS, SUBSCRIPTIONS } from '../data/mockData';
import './Home.css';

// Hero uses the first trending TMDB result, falls back to static mock
function getHeroMovie(tmdbContent) {
  const first = tmdbContent?.trending?.[0];
  return first || MOCK_MOVIES[2];
}

// ---- Helper: friend social label ----
function FriendSocialLabel({ movie }) {
  const fw = movie.friendWatchingNow;
  const fh = movie.friendsWatched;
  if (fw) return (
    <div className="friend-social-label watching">
      <div className="live-dot-green" style={{ width: 6, height: 6 }} />
      <span>{fw} is watching now</span>
    </div>
  );
  if (fh > 0) return (
    <div className="friend-social-label watched">
      <span>👥 {fh} friend{fh > 1 ? 's' : ''} watched this</span>
    </div>
  );
  return null;
}

export default function HomeScreen() {
  const { state, dispatch } = useApp();
  const { user, rooms, activityFeed, currentInsight, systemStats, tmdbContent, tmdbLoading } = state;
  const sub = SUBSCRIPTIONS[user?.subscription];
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const heroMovie = getHeroMovie(tmdbContent);

  const openRoom = (room) => {
    if (!sub.canJoinRooms) {
      dispatch({ type: 'SHOW_PAYWALL', payload: 'Join Watch Rooms' });
      return;
    }
    dispatch({ type: 'SET_JOIN_MODAL', payload: room });
  };

  const createRoom = () => {
    if (!sub.canCreateRooms) {
      dispatch({ type: 'SHOW_PAYWALL', payload: 'Create Watch Rooms' });
      return;
    }
    dispatch({ type: 'SET_CREATE_ROOM', payload: true });
  };

  const watchMovie = (movie) => {
    if (!sub.canJoinRooms) {
      dispatch({ type: 'SHOW_PAYWALL', payload: 'Watch Connect' });
      return;
    }
    const room = {
      id: `solo_${Date.now()}`,
      movieId: movie.id,
      hostId: user.id,
      name: `${user.name}'s Room`,
      isPrivate: true,
      participants: [user.id],
      playbackTime: 0,
      isPlaying: false,
      createdAt: Date.now(),
      chatCount: 0, reactionCount: 0,
    };
    dispatch({ type: 'CREATE_ROOM', payload: room });
  };

  // Rows driven entirely by TMDB data
  const ROWS = [
    { id: 'trending',  label: '🔥 Trending Now',          movies: tmdbContent.trending },
    { id: 'rec',       label: '✨ Recommended For You',    movies: tmdbContent.popular },
    { id: 'friends',   label: '👥 Watch with Friends',     movies: tmdbContent.tv },
  ];

  // Friends watching right now (from online friends)
  const friendsWatching = state.onlineFriends.filter(() => Math.random() > 0.3);

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section
        className="hero-section"
        style={{ '--backdrop': `url(${heroMovie.backdrop || heroMovie.thumbnail})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content animate-fade">
          <div className="hero-tags">
            <span className="tag tag-red">
              <div className="live-dot" /> OFFICIAL EVENT
            </span>
            {heroMovie.rating > 0 && (
              <span className="tag tag-gold">⭐ {heroMovie.rating}/10</span>
            )}
          </div>
          <h1 className="hero-title">{heroMovie.title}</h1>
          <p className="hero-desc">{heroMovie.description}</p>
          <div className="hero-meta">
            <span>{heroMovie.year}</span>
            <span className="meta-dot">·</span>
            <span>{heroMovie.duration}</span>
            {heroMovie.genre?.length > 0 && (
              <>
                <span className="meta-dot">·</span>
                <span>{heroMovie.genre.join(', ')}</span>
              </>
            )}
          </div>
          <div className="hero-actions">
            <button className="btn btn-primary btn-xl" onClick={() => watchMovie(heroMovie)}>
              ▶ Watch Now
            </button>
            <button className="btn btn-glass btn-xl" onClick={createRoom}>
              👥 Invite Friends
            </button>
          </div>
          <div className="hero-room-info">
            <div className="live-dot-green" />
            <span>{state.onlineFriends.length} friends online now</span>
          </div>
        </div>
      </section>

      {/* AI Insight Banner */}
      <div className="insight-banner animate-fade">
        <span className="insight-icon">{currentInsight.icon}</span>
        <span className="insight-text">{currentInsight.text}</span>
        <span className="tag tag-purple">AI Insight</span>
      </div>

      {/* Main Layout */}
      <div className="home-main">
        {/* Left: Content rows */}
        <div className="home-rows">

          {/* Loading skeleton */}
          {tmdbLoading && (
            <div className="tmdb-loading">
              <div className="loading-spinner" />
              <span>Loading latest content…</span>
            </div>
          )}

          {/* TMDB-powered rows */}
          {!tmdbLoading && ROWS.map(row => (
            <section key={row.id} className="content-row">
              <h2 className="row-title">{row.label}</h2>
              <div className="movie-strip">
                {row.movies.length === 0 && (
                  <div className="empty-row">No content available right now.</div>
                )}
                {row.movies.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isHovered={hoveredMovie === movie.id}
                    onHover={() => setHoveredMovie(movie.id)}
                    onLeave={() => setHoveredMovie(null)}
                    onWatch={() => watchMovie(movie)}
                    onParty={() => {
                      const room = rooms.find(r => r.movieId === movie.id);
                      if (room) openRoom(room); else createRoom();
                    }}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* ---- Official Events (only public rooms) ---- */}
          <section className="content-row">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 className="row-title">🔴 Official Events</h2>
              <span className="tag tag-red" style={{ fontSize: '0.72rem' }}>Netflix Exclusive</span>
            </div>
            <div className="rooms-grid">
              {OFFICIAL_EVENTS.map(ev => {
                const movie = MOCK_MOVIES.find(m => m.id === ev.movieId);
                return (
                  <OfficialEventCard
                    key={ev.id}
                    event={ev}
                    movie={movie}
                    onJoin={() => openRoom(ev)}
                  />
                );
              })}
            </div>
          </section>

          {/* ---- Friends Watching Now ---- */}
          <section className="content-row">
            <h2 className="row-title">👥 Friends Watching Now</h2>
            {friendsWatching.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <div style={{ fontSize: '2rem' }}>🎬</div>
                <div>None of your friends are watching right now</div>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 12 }}
                  onClick={() => dispatch({ type: 'SET_INVITE_MODAL', payload: true })}
                >
                  Invite friends to watch
                </button>
              </div>
            ) : (
              <div className="friends-watching-row">
                {friendsWatching.map(f => {
                  const randomMovie = tmdbContent.trending[Math.floor(Math.random() * Math.max(1, tmdbContent.trending.length))];
                  return (
                    <FriendWatchingCard key={f.id} friend={f} movie={randomMovie} onInvite={() => dispatch({ type: 'SET_INVITE_MODAL', payload: true })} />
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right: Activity sidebar */}
        <aside className="home-sidebar">
          {/* Friends Online */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <span>👥 Friends Online</span>
              <span className="tag tag-green">{state.onlineFriends.length} online</span>
            </div>
            {state.onlineFriends.map(f => (
              <div key={f.id} className="friend-row">
                <div style={{ position: 'relative' }}>
                  <img src={f.avatar} alt={f.name} className="avatar" style={{ width: 36, height: 36 }} />
                  <div className="online-dot" />
                </div>
                <div className="friend-info">
                  <div className="friend-name">{f.name}</div>
                  <div className="friend-status">Watching something</div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => dispatch({ type: 'SET_INVITE_MODAL', payload: true })}
                >Invite</button>
              </div>
            ))}
            <button
              className="btn btn-ghost btn-sm w-full"
              style={{ marginTop: 8 }}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'friends' })}
            >View All Friends</button>
          </div>

          {/* Recently watched with friends */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <span>🕑 Recently With Friends</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(tmdbContent.trending.slice(0, 3)).map((m, i) => (
                <div key={m.id} className="recent-with-friends-row">
                  <img src={m.thumbnail} alt={m.title} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {['Jamie', 'Sam', 'Priya'][i]} watched {['2d', '4d', '1w'][i]} ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <span>⚡ Friends Activity</span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div className="live-dot" />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live</span>
              </div>
            </div>
            <div className="activity-feed">
              {activityFeed.length === 0 ? (
                <div className="no-activity">Activity will appear here…</div>
              ) : (
                activityFeed.slice(0, 8).map((a, i) => (
                  <div key={a.id || i} className="activity-item animate-fade">
                    <img src={a.avatar} alt="" className="avatar" style={{ width: 28, height: 28 }} />
                    <div className="activity-text">{a.text}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Invite CTA */}
          <div className="sidebar-card invite-cta-card">
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🔒</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Private Watch Rooms</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              Your rooms are invite-only. Only friends can join.
            </div>
            <button
              className="btn btn-primary btn-sm w-full"
              onClick={createRoom}
            >
              + Start a Private Room
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---- MovieCard — friends-first badge, no public room count ----
function MovieCard({ movie, isHovered, onHover, onLeave, onWatch, onParty }) {
  return (
    <div
      className={`movie-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="movie-thumb-wrap">
        <img src={movie.thumbnail} alt={movie.title} className="movie-thumb" loading="lazy" />
        <div className="movie-thumb-overlay">
          <button className="movie-play-btn" onClick={onWatch}>▶</button>
          <button className="movie-party-btn" onClick={onParty}>👥</button>
        </div>
        {/* Friend social badge — replaces "X rooms" */}
        <FriendSocialLabel movie={movie} />
      </div>
      <div className="movie-info">
        <div className="movie-title-sm">{movie.title}</div>
        <div className="movie-meta-sm">
          {movie.rating > 0 && <span>⭐ {movie.rating}</span>}
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
        </div>
      </div>
    </div>
  );
}

// ---- OfficialEventCard — public only for Netflix events ----
function OfficialEventCard({ event, movie, onJoin }) {
  return (
    <div className="room-card official-event-card" onClick={onJoin}>
      <div className="room-card-thumb">
        <img
          src={movie?.thumbnail || movie?.backdrop}
          alt={movie?.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="room-card-overlay">
          <span className="tag tag-gold" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
            ★ Official Event
          </span>
          {event.isLive && (
            <span className="tag tag-red" style={{ fontSize: '0.7rem' }}>
              <div className="live-dot" /> LIVE
            </span>
          )}
        </div>
      </div>
      <div className="room-card-info">
        <div className="room-name">{event.name}</div>
        <div className="room-movie-name" style={{ color: 'var(--accent)', fontSize: '0.72rem', marginBottom: 4 }}>
          {event.eventType}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <img src={event.hostAvatar} alt={event.hostName} className="avatar" style={{ width: 20, height: 20 }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hosted by {event.hostName}</span>
        </div>
        <div className="room-participants">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔥 {event.reactionCount.toLocaleString()} reactions
          </span>
        </div>
        <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 8 }}>
          Join Event
        </button>
      </div>
    </div>
  );
}

// ---- FriendWatchingCard ----
function FriendWatchingCard({ friend, movie, onInvite }) {
  return (
    <div className="friend-watching-card">
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={friend.avatar} alt={friend.name} className="avatar" style={{ width: 44, height: 44 }} />
        <div className="online-dot" style={{ position: 'absolute', bottom: 0, right: 0 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{friend.name}</div>
        {movie ? (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            🎬 {movie.title}
          </div>
        ) : (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Browsing…</div>
        )}
      </div>
      <button className="btn btn-ghost btn-sm" onClick={onInvite}>Invite</button>
    </div>
  );
}
