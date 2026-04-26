// =============================================
//  MODALS: Paywall, CreateRoom, JoinRoom, Invite
// =============================================
import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { SUBSCRIPTIONS, MOCK_MOVIES, MOCK_USERS } from '../data/mockData';
import './Modals.css';

/* ---- PAYWALL MODAL ---- */
export function PaywallModal() {
  const { state, dispatch } = useApp();
  const { paywallFeature, user } = state;
  const currentSub = SUBSCRIPTIONS[user?.subscription];

  const upgradeTo = user?.subscription === 'basic' ? 'standard' :
                    user?.subscription === 'standard' ? 'premium' : 'premium_plus';
  const targetSub = SUBSCRIPTIONS[upgradeTo];

  return (
    <div className="overlay" onClick={() => dispatch({ type: 'HIDE_PAYWALL' })}>
      <div className="modal paywall-modal animate-scale" onClick={e => e.stopPropagation()}>
        <h2 className="paywall-title">Upgrade Required</h2>
        <p className="paywall-feature">
          <strong>{paywallFeature}</strong> requires a higher plan.
        </p>
        <div className="paywall-tier-compare">
          <div className="tier-box current-tier">
            <div className="tier-box-label">Current</div>
            <div className="tier-box-name" style={{color: currentSub?.color}}>{currentSub?.name}</div>
            <div className="tier-box-price">${currentSub?.price}/mo</div>
          </div>
          <div className="tier-arrow">→</div>
          <div className="tier-box next-tier">
            <div className="tier-box-label">Recommended</div>
            <div className="tier-box-name" style={{color: targetSub?.color}}>{targetSub?.name}</div>
            <div className="tier-box-price">${targetSub?.price}/mo</div>
          </div>
        </div>
        {targetSub?.connectFeatures.length > 0 && (
          <div className="paywall-features">
            {targetSub.connectFeatures.slice(0, 3).map(f => (
              <div key={f} className="paywall-feature-item">✦ {f}</div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              dispatch({ type: 'HIDE_PAYWALL' });
              dispatch({ type: 'SET_VIEW', payload: 'payment' });
            }}
          >
            Upgrade to {targetSub?.name} →
          </button>
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'HIDE_PAYWALL' })}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- CREATE ROOM MODAL ---- */
export function CreateRoomModal() {
  const { state, dispatch } = useApp();
  const { user, tmdbContent } = state;

  // Merge TMDB movies with static fallback
  const allMovies = [
    ...(tmdbContent?.trending || []),
    ...(tmdbContent?.popular || []),
    ...MOCK_MOVIES,
  ].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i); // deduplicate

  const [selectedMovieId, setSelectedMovieId] = useState(allMovies[0]?.id || MOCK_MOVIES[0].id);
  const [roomName, setRoomName] = useState(`${user?.name?.split(' ')[0]}'s Watch Party`);
  const [isPrivate, setIsPrivate] = useState(true); // default private
  const [creating, setCreating] = useState(false);

  const selectedMovie = allMovies.find(m => m.id === selectedMovieId) || MOCK_MOVIES[0];

  const createRoom = async (e) => {
    e.preventDefault();
    setCreating(true);
    await delay(800);
    const room = {
      id: `room_${Date.now()}`,
      movieId: selectedMovieId,
      hostId: user.id,
      name: roomName,
      isPrivate,
      participants: [user.id],
      playbackTime: 0,
      isPlaying: false,
      createdAt: Date.now(),
      chatCount: 0, reactionCount: 0,
    };
    dispatch({ type: 'CREATE_ROOM', payload: { ...room, _movieObj: selectedMovie } });
    dispatch({ type: 'SET_TOAST', payload: { msg: '🎬 Private room created! Invite your friends.', type: 'success' } });
    setCreating(false);
  };

  return (
    <div className="overlay" onClick={() => dispatch({ type: 'SET_CREATE_ROOM', payload: false })}>
      <div className="modal animate-scale" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Create Watch Party</h2>
        <form onSubmit={createRoom} className="modal-form">
          <div className="form-group">
            <label className="form-label">Room Name</label>
            <input className="input" value={roomName} onChange={e => setRoomName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Select Movie or Show</label>
            <select
              className="select w-full"
              value={selectedMovieId}
              onChange={e => setSelectedMovieId(e.target.value)}
            >
              {allMovies.map(m => (
                <option key={m.id} value={m.id}>{m.title} ({m.year})</option>
              ))}
            </select>
          </div>
          {selectedMovie && (
            <div className="movie-preview">
              <img
                src={selectedMovie.thumbnail}
                alt=""
                className="movie-preview-thumb"
              />
              <div>
                <div style={{fontWeight:600}}>{selectedMovie.title}</div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>
                  {selectedMovie.year} · {selectedMovie.duration}
                </div>
              </div>
            </div>
          )}
          <div className="toggle-row">
            <div>
              <div style={{fontWeight:600}}>Private Room</div>
              <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>Only invited friends can join</div>
            </div>
            <div
              className={`toggle ${isPrivate ? 'on' : 'off'}`}
              onClick={() => setIsPrivate(v => !v)}
            >
              <div className="toggle-knob" />
            </div>
          </div>
          <div className="room-link-preview">
            <span className="link-label">Room Link</span>
            <code className="link-code">netflix.com/connect/room/{`${Date.now()}`.slice(-6)}</code>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={creating}>
              {creating ? <><span className="animate-spin">REF</span> Creating…</> : 'Start Watch Party'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'SET_CREATE_ROOM', payload: false })}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---- JOIN ROOM MODAL ---- */
export function JoinRoomModal() {
  const { state, dispatch } = useApp();
  const { showJoinModal: room } = state;
  if (!room) return null;
  const movie = MOCK_MOVIES.find(m => m.id === room.movieId);
  const host = MOCK_USERS.find(u => u.id === room.hostId);
  const participants = room.participants.map(id => MOCK_USERS.find(u => u.id === id)).filter(Boolean);

  return (
    <div className="overlay" onClick={() => dispatch({ type: 'SET_JOIN_MODAL', payload: null })}>
      <div className="modal join-modal animate-scale" onClick={e => e.stopPropagation()}>
        <div className="join-movie-banner">
          <img src={movie?.thumbnail} alt={movie?.title} className="join-movie-thumb" />
          <div className="join-overlay" />
          <div className="join-movie-info">
            {room.isLive && <span className="tag tag-red" style={{marginBottom:8,display:'inline-flex'}}><div className="live-dot" /> LIVE</span>}
            <div className="join-movie-title">{movie?.title}</div>
            <div style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)'}}>Hosted by {host?.name}</div>
          </div>
        </div>

        <div className="join-details">
          <div className="join-room-name">{room.name}</div>
          <div className="join-participants">
            <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:8}}>
              {participants.length} people watching
            </div>
            <div style={{display:'flex',gap:6}}>
              {participants.map(p => (
                <div key={p.id} style={{textAlign:'center'}}>
                  <img src={p.avatar} alt={p.name} className="avatar" style={{width:36,height:36}} />
                  <div style={{fontSize:'0.62rem',color:'var(--text-muted)',marginTop:2}}>{p.name.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="join-status">
            <div className={`join-status-item ${room.isPlaying ? 'playing' : 'paused'}`}>
              {room.isPlaying ? '▶ Currently Playing' : '⏸ Paused'}
            </div>
            <div className="join-status-item">🔗 {room.isPrivate ? 'Private Room' : 'Public Room'}</div>
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-primary btn-xl w-full"
              onClick={() => dispatch({ type: 'JOIN_ROOM', payload: room })}
            >
              Join Watch Party
            </button>
            <button className="btn btn-ghost" onClick={() => dispatch({ type: 'SET_JOIN_MODAL', payload: null })}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- INVITE MODAL ---- */
export function InviteModal() {
  const { state, dispatch } = useApp();
  const { user, activeRoom } = state;
  const friends = MOCK_USERS.filter(u => user?.friends?.includes(u.id));
  const [invited, setInvited] = useState([]);
  const roomId = activeRoom?.id || `room_${Date.now()}`.slice(-6);
  const shareLink = `netflix.com/connect/room/${roomId}`;

  const invite = (friendId) => {
    setInvited(v => [...v, friendId]);
    const friend = friends.find(f => f.id === friendId);
    dispatch({ type: 'SET_TOAST', payload: { msg: `Invite sent to ${friend?.name}! 📨`, type: 'success' } });
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(shareLink);
    dispatch({ type: 'SET_TOAST', payload: { msg: '🔗 Link copied to clipboard!', type: 'success' } });
  };

  return (
    <div className="overlay" onClick={() => dispatch({ type: 'SET_INVITE_MODAL', payload: false })}>
      <div className="modal animate-scale" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Invite Friends</h2>
        <div className="invite-link-box">
          <code className="link-code" style={{flex:1}}>{shareLink}</code>
          <button className="btn btn-primary btn-sm" onClick={copyLink}>Copy</button>
        </div>
        <div className="invite-divider"><span>Or invite directly</span></div>
        <div className="invite-friends-list">
          {friends.map(f => (
            <div key={f.id} className="invite-friend-row">
              <img src={f.avatar} alt={f.name} className="avatar" style={{width:36,height:36}} />
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:'0.875rem'}}>{f.name}</div>
                <div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{f.subscription} member</div>
              </div>
              <button
                className={`btn btn-sm ${invited.includes(f.id) ? 'btn-accent' : 'btn-ghost'}`}
                onClick={() => invite(f.id)}
                disabled={invited.includes(f.id)}
              >
                {invited.includes(f.id) ? '✓ Invited' : 'Invite'}
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost w-full" style={{marginTop:16}}
          onClick={() => dispatch({ type: 'SET_INVITE_MODAL', payload: false })}>
          Done
        </button>
      </div>
    </div>
  );
}

const delay = ms => new Promise(r => setTimeout(r, ms));
