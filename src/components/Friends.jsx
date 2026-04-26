// =============================================
//  FRIENDS SCREEN
// =============================================
import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { MOCK_USERS, MOCK_MOVIES } from '../data/mockData';
import './Friends.css';

export default function FriendsScreen() {
  const { state, dispatch } = useApp();
  const { user, activityFeed } = state;
  const [search, setSearch] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [tab, setTab] = useState('friends'); // friends | discover | activity

  const myFriends = MOCK_USERS.filter(u => user?.friends?.includes(u.id));
  const discover = MOCK_USERS.filter(u => u.id !== user?.id && !user?.friends?.includes(u.id));
  const filtered = myFriends.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const inviteToWatch = (friend) => {
    dispatch({ type: 'SET_INVITE_MODAL', payload: true });
    dispatch({ type: 'SET_TOAST', payload: { msg: `Invitation sent to ${friend.name}! 📨`, type: 'success' } });
  };

  const addFriend = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_TOAST', payload: { msg: `Friend request sent to ${addEmail}! ✉️`, type: 'success' } });
    setAddEmail('');
  };

  return (
    <div className="friends-container">
      <div className="friends-header animate-fade">
        <h1 className="friends-title">👥 Friends & Social</h1>
        <p className="friends-subtitle">Connect with friends and watch together</p>
      </div>

      {/* Tabs */}
      <div className="friends-tabs">
        {[
          { id: 'friends', label: '👥 My Friends', count: myFriends.length },
          { id: 'discover', label: '🔍 Discover People' },
          { id: 'activity', label: '⚡ Activity Feed', count: activityFeed.length },
        ].map(t => (
          <button key={t.id} className={`friends-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count !== undefined && <span className="badge" style={{marginLeft:6}}>{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'friends' && (
        <div className="friends-content animate-fade">
          <div className="friends-toolbar">
            <input className="input" placeholder="🔍 Search friends…" value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth:320}} />
            <form onSubmit={addFriend} style={{display:'flex',gap:8}}>
              <input className="input" placeholder="Add by email…" value={addEmail} onChange={e => setAddEmail(e.target.value)} style={{width:240}} />
              <button type="submit" className="btn btn-primary btn-sm">Add Friend</button>
            </form>
          </div>

          <div className="friends-grid">
            {filtered.map(friend => {
              const isOnline = Math.random() > 0.3;
              const watchingNow = MOCK_MOVIES[Math.floor(Math.random() * MOCK_MOVIES.length)];
              return (
                <div key={friend.id} className="friend-card">
                  <div className="friend-card-header">
                    <div style={{position:'relative'}}>
                      <img src={friend.avatar} alt={friend.name} className="avatar" style={{width:56,height:56}} />
                      <div className={`friend-online-dot ${isOnline ? 'online' : 'offline'}`} />
                    </div>
                    <div className="friend-card-info">
                      <div className="friend-card-name">{friend.name}</div>
                      <div className={`friend-card-status ${isOnline ? 'status-online' : 'status-offline'}`}>
                        {isOnline ? '● Online' : '○ Offline'}
                      </div>
                      <div className={`friend-tier tier-${friend.subscription}`}>
                        {friend.subscription.replace('_plus', '+')} Member
                      </div>
                    </div>
                  </div>

                  {isOnline && (
                    <div className="friend-watching">
                      🎬 Watching: <strong>{watchingNow.title}</strong>
                    </div>
                  )}

                  <div className="friend-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => inviteToWatch(friend)}>
                      🎬 Invite to Watch
                    </button>
                    <button className="btn btn-ghost btn-sm">Message</button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <div style={{fontSize:'3rem'}}>👥</div>
              <div>No friends found</div>
            </div>
          )}
        </div>
      )}

      {tab === 'discover' && (
        <div className="friends-content animate-fade">
          <p style={{color:'var(--text-muted)',marginBottom:24}}>People you might know on Netflix Connect</p>
          <div className="friends-grid">
            {discover.map(person => (
              <div key={person.id} className="friend-card">
                <div className="friend-card-header">
                  <img src={person.avatar} alt={person.name} className="avatar" style={{width:56,height:56}} />
                  <div className="friend-card-info">
                    <div className="friend-card-name">{person.name}</div>
                    <div className="friend-card-meta">{person.watchHistory.length} titles watched</div>
                    <div className={`friend-tier tier-${person.subscription}`}>
                      {person.subscription.replace('_plus', '+')}
                    </div>
                  </div>
                </div>
                <div className="friend-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      dispatch({ type: 'SET_TOAST', payload: { msg: `Friend request sent to ${person.name}! ✉️`, type: 'success' } });
                    }}
                  >+ Add Friend</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="activity-list animate-fade">
          {activityFeed.length === 0 && (
            <div className="empty-state">
              <div style={{fontSize:'3rem'}}>⚡</div>
              <div>Activity from your friends will appear here</div>
            </div>
          )}
          {activityFeed.map((a, i) => (
            <div key={a.id || i} className="activity-full-item">
              <img src={a.avatar} alt="" className="avatar" style={{width:44,height:44}} />
              <div className="activity-full-content">
                <div className="activity-full-text">{a.text}</div>
                <div className="activity-full-time">{a.time}</div>
              </div>
              <button className="btn btn-ghost btn-sm">Join</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
