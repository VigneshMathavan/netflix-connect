// =============================================
//  CREATOR HUB SCREEN
// =============================================
import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { MOCK_CREATORS, MOCK_MOVIES } from '../data/mockData';
import './Creator.css';

const CREATOR_TIERS = [
  { id: 'creator_basic', name: 'Creator Basic', price: 'Free', color: '#666',
    features: ['Official watch rooms', 'Basic analytics'] },
  { id: 'creator_plus', name: 'Creator Plus', price: '$99/mo', color: '#4285F4',
    features: ['Branded events', 'Homepage highlights', 'Fan messaging'] },
  { id: 'creator_pro', name: 'Creator Pro', price: '$299/mo', color: '#E50914',
    features: ['Fan Q&A system', 'Advanced analytics', 'Priority placement'] },
  { id: 'creator_enterprise', name: 'Creator Enterprise', price: 'Custom', color: '#F5C518',
    features: ['Sponsored campaigns', 'Targeted events', 'Dedicated support', 'White-label rooms'] },
];

export default function CreatorScreen() {
  const { state, dispatch } = useApp();
  const { user, creatorStats } = state;
  const [tab, setTab] = useState('creators'); // creators | dashboard | tiers

  const isPremiumPlus = user?.subscription === 'premium_plus';

  const joinCreatorRoom = (creator) => {
    if (!isPremiumPlus) {
      dispatch({ type: 'SHOW_PAYWALL', payload: 'Creator Events' });
      return;
    }
    const movie = MOCK_MOVIES[0];
    const room = {
      id: `creator_${Date.now()}`,
      movieId: movie.id,
      hostId: creator.id,
      name: `${creator.name} LIVE EVENT`,
      isPrivate: false,
      participants: ['u1', 'u2', 'u3', 'u4', 'u5'],
      playbackTime: 0,
      isPlaying: true,
      createdAt: Date.now(),
      chatCount: 4820, reactionCount: 1203, isLive: true,
    };
    dispatch({ type: 'CREATE_ROOM', payload: room });
    dispatch({ type: 'SET_TOAST', payload: { msg: `Joined ${creator.name}'s live event! 🎬`, type: 'success' } });
  };

  return (
    <div className="creator-container">
      <div className="creator-header animate-fade">
        <div className="tag tag-red" style={{display:'inline-flex',gap:6,alignItems:'center',marginBottom:16}}>
          <div className="live-dot" /> Creator Connect
        </div>
        <h1 className="creator-title">Creator Hub</h1>
        <p className="creator-subtitle">Engage directly with the creators behind your favorite content</p>
      </div>

      {/* Tabs */}
      <div className="creator-tabs">
        {[
          { id: 'creators', label: '🌟 Featured Creators' },
          { id: 'dashboard', label: '📊 Creator Dashboard' },
          { id: 'tiers', label: '🎯 Creator Tiers' },
        ].map(t => (
          <button key={t.id} className={`creator-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'creators' && (
        <div className="creators-content animate-fade">
          {/* Live Events Banner */}
          <div className="live-events-banner">
            <div className="live-events-left">
              <span className="tag tag-red"><div className="live-dot" /> LIVE NOW</span>
              <h3>Apex Studios: Stellar Minds Watch Party</h3>
              <p>Director's commentary + Fan Q&A — 12,840 viewers watching live</p>
              <button className="btn btn-primary btn-lg" onClick={() => joinCreatorRoom(MOCK_CREATORS[0])}>
                Join Live Event 🎬
              </button>
            </div>
            <div className="live-events-right">
              <div className="live-stat">
                <div className="live-stat-val">{state.creatorStats.liveViewers.toLocaleString()}</div>
                <div className="live-stat-label">Live Viewers</div>
              </div>
              <div className="live-stat">
                <div className="live-stat-val">{state.creatorStats.messagesPerMin}</div>
                <div className="live-stat-label">Msg/Min</div>
              </div>
              <div className="live-stat">
                <div className="live-stat-val">{state.creatorStats.engagementRate}%</div>
                <div className="live-stat-label">Engagement</div>
              </div>
            </div>
          </div>

          {/* Creator Cards */}
          <div className="creators-grid">
            {MOCK_CREATORS.map(creator => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                onJoin={() => joinCreatorRoom(creator)}
                isPremiumPlus={isPremiumPlus}
              />
            ))}
          </div>
        </div>
      )}

      {tab === 'dashboard' && (
        <div className="dashboard-content animate-fade">
          <div className="dashboard-header-row">
            <h2 style={{fontWeight:700}}>Live Creator Dashboard</h2>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div className="live-dot" />
              <span style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Updating every 2s</span>
            </div>
          </div>

          {/* Main stats */}
          <div className="dashboard-stats-grid">
            <div className="stat-card" style={{borderColor:'rgba(229,9,20,0.3)'}}>
              <div style={{fontSize:'2rem',marginBottom:8}}>👁️</div>
              <div className="stat-value" style={{color:'var(--primary)'}}>{creatorStats.liveViewers.toLocaleString()}</div>
              <div className="stat-label">Live Viewers</div>
              <div className="stat-change" style={{color:'var(--accent)'}}>↑ +823 from 1 min ago</div>
            </div>
            <div className="stat-card" style={{borderColor:'rgba(29,185,84,0.3)'}}>
              <div style={{fontSize:'2rem',marginBottom:8}}>💬</div>
              <div className="stat-value" style={{color:'var(--accent)'}}>{creatorStats.messagesPerMin}</div>
              <div className="stat-label">Messages/Min</div>
              <div className="stat-change" style={{color:'var(--accent)'}}>↑ Very High Activity</div>
            </div>
            <div className="stat-card" style={{borderColor:'rgba(245,197,24,0.3)'}}>
              <div style={{fontSize:'2rem',marginBottom:8}}>⚡</div>
              <div className="stat-value" style={{color:'var(--gold)'}}>{creatorStats.engagementRate}%</div>
              <div className="stat-label">Engagement Rate</div>
              <div className="stat-change" style={{color:'var(--gold)'}}>↑ Peak Engagement</div>
            </div>
            <div className="stat-card">
              <div style={{fontSize:'2rem',marginBottom:8}}>🏆</div>
              <div className="stat-value">Top 1%</div>
              <div className="stat-label">Global Room Rank</div>
              <div className="stat-change" style={{color:'var(--accent)'}}>🔥 Trending</div>
            </div>
          </div>

          {/* Reaction spike chart */}
          <div className="reaction-chart-card">
            <div className="chart-header">
              <span className="chart-title">⚡ Reaction Spikes (Last 10 Minutes)</span>
              <span className="tag tag-red">Top: {creatorStats.topReaction}</span>
            </div>
            <div className="bar-chart">
              {creatorStats.reactionSpikes.map((val, i) => (
                <div key={i} className="bar-wrap">
                  <div
                    className="bar"
                    style={{ height: `${val}%`, background: `hsl(${val * 1.2 + 0}, 85%, 55%)` }}
                    data-tip={`${val}%`}
                  />
                  <div className="bar-label">{(i + 1) * 1}m</div>
                </div>
              ))}
            </div>
          </div>

          {/* Q&A Feed */}
          <div className="qa-section">
            <h3 className="section-title">🎤 Fan Q&A Queue</h3>
            {[
              { user: 'Maria R.', q: 'What inspired the final scene of Stellar Minds?', votes: 234 },
              { user: 'Tom K.', q: 'Will there be a Season 2?', votes: 189 },
              { user: 'Aisha P.', q: 'How long did filming take?', votes: 142 },
              { user: 'Leo C.', q: 'What was the hardest scene to shoot?', votes: 98 },
            ].map((qa, i) => (
              <div key={i} className="qa-item">
                <div className="qa-rank">#{i + 1}</div>
                <div className="qa-content">
                  <div className="qa-user">{qa.user}</div>
                  <div className="qa-question">{qa.q}</div>
                </div>
                <div className="qa-votes">👍 {qa.votes}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'tiers' && (
        <div className="tiers-content animate-fade">
          <p style={{color:'var(--text-muted)',marginBottom:32,textAlign:'center'}}>
            Partner with Netflix Connect to reach millions of engaged viewers
          </p>
          <div className="tiers-grid">
            {CREATOR_TIERS.map(tier => (
              <div key={tier.id} className="tier-card">
                <div className="tier-name" style={{color:tier.color}}>{tier.name}</div>
                <div className="tier-price">{tier.price}</div>
                <div className="tier-features">
                  {tier.features.map(f => (
                    <div key={f} className="tier-feature">✓ {f}</div>
                  ))}
                </div>
                <button className="btn btn-ghost btn-lg w-full" style={{justifyContent:'center',marginTop:'auto'}}>
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreatorCard({ creator, onJoin, isPremiumPlus }) {
  const TIER_LABELS = {
    creator_basic: { label: 'Basic', color: '#666' },
    creator_plus: { label: 'Plus', color: '#4285F4' },
    creator_pro: { label: 'Pro', color: '#E50914' },
    creator_enterprise: { label: 'Enterprise', color: '#F5C518' },
  };
  const tierInfo = TIER_LABELS[creator.tier];

  return (
    <div className="creator-card">
      <div className="creator-card-top">
        <img src={creator.avatar} alt={creator.name} className="creator-avatar" />
        <div className="creator-info">
          <div className="creator-name">
            {creator.name}
            {creator.verified && <span className="creator-verified" title="Verified">✓</span>}
          </div>
          <div className="creator-type">{creator.type}</div>
          <div className="creator-tier-badge" style={{color:tierInfo.color}}>
            ★ {tierInfo.label}
          </div>
          <div className="creator-followers">{(creator.followers / 1000).toFixed(0)}k followers</div>
        </div>
      </div>

      <p className="creator-desc">{creator.description}</p>

      {creator.upcomingEvents.length > 0 && (
        <div className="creator-events">
          <div className="events-label">📅 Upcoming Events</div>
          {creator.upcomingEvents.map(ev => (
            <div key={ev} className="event-item">🔔 {ev}</div>
          ))}
        </div>
      )}

      <div className="creator-actions">
        {creator.activeRoom ? (
          <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={onJoin}>
            <div className="live-dot" style={{width:6,height:6}} /> Watch Live
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" style={{flex:1}}>🔔 Set Reminder</button>
        )}
        <button className="btn btn-ghost btn-sm">Follow</button>
      </div>

      {!isPremiumPlus && creator.activeRoom && (
        <div className="creator-paywall-hint">
          ⭐ Premium+ required for Creator Events
        </div>
      )}
    </div>
  );
}
