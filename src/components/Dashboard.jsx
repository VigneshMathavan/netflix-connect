// =============================================
//  LIVE STATS DASHBOARD
// =============================================
import { useApp } from '../store/AppStore';
import { MOCK_ROOMS, MOCK_MOVIES, MOCK_USERS } from '../data/mockData';
import './Dashboard.css';

export default function DashboardScreen() {
  const { state } = useApp();
  const { systemStats, currentInsight, creatorStats } = state;

  const topRooms = MOCK_ROOMS.map(r => ({
    ...r,
    movie: MOCK_MOVIES.find(m => m.id === r.movieId),
    host: MOCK_USERS.find(u => u.id === r.hostId),
  }));

  const metrics = [
    {
      label: 'Active Rooms', value: systemStats.activeRooms.toLocaleString(),
      delta: systemStats.activeRoomDelta, color: 'var(--primary)', icon: '🎬',
    },
    {
      label: 'Users Online', value: systemStats.usersOnline.toLocaleString(),
      delta: systemStats.usersDelta, color: 'var(--accent)', icon: '👥',
    },
    {
      label: 'Messages/Min', value: systemStats.messagesPerMin.toLocaleString(),
      delta: systemStats.msgDelta, color: '#4285F4', icon: '💬',
    },
    {
      label: 'Engagement', value: `${systemStats.engagementRate}%`,
      delta: systemStats.engageDelta, color: 'var(--gold)', icon: '⚡',
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="db-header animate-fade">
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
          <h1 className="db-title">Live System Dashboard</h1>
          <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(229,9,20,0.1)',border:'1px solid rgba(229,9,20,0.3)',borderRadius:20,padding:'4px 12px'}}>
            <div className="live-dot" />
            <span style={{fontSize:'0.75rem',fontWeight:700,color:'var(--primary)'}}>LIVE</span>
          </div>
        </div>
        <p style={{color:'var(--text-muted)'}}>Real-time platform metrics updating every 2–3 seconds</p>
      </div>

      {/* Main Metrics */}
      <div className="db-metrics-grid animate-fade">
        {metrics.map(m => (
          <div key={m.label} className="db-metric-card">
            <div className="db-metric-icon">{m.icon}</div>
            <div className="db-metric-value" style={{color:m.color}}>{m.value}</div>
            <div className="db-metric-label">{m.label}</div>
            <div className="db-metric-delta" style={{color:'var(--accent)'}}>↑ {m.delta}</div>
          </div>
        ))}
      </div>

      {/* Body Grid */}
      <div className="db-body">
        {/* AI Insights Panel */}
        <div className="db-insights-panel">
          <div className="db-panel-header">
            <span>🧠 AI Insights</span>
            <span className="tag tag-purple">Live</span>
          </div>
          <div className="insight-card highlight">
            <div className="insight-main-icon">{currentInsight.icon}</div>
            <div className="insight-main-text">{currentInsight.text}</div>
          </div>

          <div className="db-panel-header" style={{marginTop:24}}>
            <span>🔮 Predictions</span>
          </div>
          {[
            { icon:'🔮', text:'Expected 32% engagement spike in 8 minutes' },
            { icon:'🎯', text:'92% retention probability for current sessions' },
            { icon:'📈', text:'Trending surge detected in Sci-Fi category' },
            { icon:'⏰', text:'Peak watch party hours begin in 45 minutes' },
          ].map((p, i) => (
            <div key={i} className="prediction-item">
              <span className="pred-icon">{p.icon}</span>
              <span className="pred-text">{p.text}</span>
            </div>
          ))}
        </div>

        {/* Top Rooms */}
        <div className="db-top-rooms">
          <div className="db-panel-header">
            <span>🔥 Top Active Rooms</span>
            <span className="tag tag-green">{systemStats.activeRooms} total</span>
          </div>
          {topRooms.map((room, i) => (
            <div key={room.id} className="db-room-row">
              <div className="db-room-rank">#{i + 1}</div>
              <img src={room.movie?.thumbnail} alt="" style={{width:56,height:32,objectFit:'cover',borderRadius:4,flexShrink:0}} />
              <div className="db-room-info">
                <div className="db-room-name">{room.name}</div>
                <div className="db-room-movie">{room.movie?.title}</div>
              </div>
              <div className="db-room-stats">
                <div className="db-room-stat">👥 {room.participants.length}</div>
                <div className="db-room-stat">💬 {room.chatCount}</div>
                {room.isLive && <span className="tag tag-red" style={{fontSize:'0.65rem'}}>LIVE</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Creator Live Stats */}
        <div className="db-creator-stats">
          <div className="db-panel-header">
            <span>🎬 Creator Live Stats</span>
          </div>
          <div className="creator-live-grid">
            <div className="creator-live-card">
              <div className="clc-icon">👁️</div>
              <div className="clc-val">{creatorStats.liveViewers.toLocaleString()}</div>
              <div className="clc-label">Live Viewers</div>
            </div>
            <div className="creator-live-card">
              <div className="clc-icon">💬</div>
              <div className="clc-val">{creatorStats.messagesPerMin}</div>
              <div className="clc-label">Msg/Min</div>
            </div>
            <div className="creator-live-card">
              <div className="clc-icon">⚡</div>
              <div className="clc-val">{creatorStats.engagementRate}%</div>
              <div className="clc-label">Engagement</div>
            </div>
          </div>

          {/* Activity log */}
          <div className="db-panel-header" style={{marginTop:20}}>
            <span>📋 System Events</span>
          </div>
          <div className="event-log">
            {[
              { time:'Now',   icon:'🟢', msg:'New room created: "Movie Night 🎬"' },
              { time:'2s',    icon:'💬', msg:'3,847 messages sent in last minute' },
              { time:'5s',    icon:'👥', msg:'User joined: Stellar Minds premiere room' },
              { time:'8s',    icon:'⚡', msg:'Reaction spike detected in Room #r3' },
              { time:'12s',   icon:'🔗', msg:'Invite link generated for Iron District' },
              { time:'18s',   icon:'🎬', msg:'Creator event started: Apex Studios' },
              { time:'25s',   icon:'🏆', msg:'Room #r3 reached 5,000 messages milestone' },
            ].map((ev, i) => (
              <div key={i} className="event-log-item">
                <span className="event-time">{ev.time}</span>
                <span className="event-icon">{ev.icon}</span>
                <span className="event-msg">{ev.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
