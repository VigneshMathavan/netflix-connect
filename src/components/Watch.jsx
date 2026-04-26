// =============================================
//  WATCH ROOM – Core viewing experience
// =============================================
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppStore';
import { MOCK_USERS, EMOJIS, REACTIONS } from '../data/mockData';
import './Watch.css';

export default function WatchScreen() {
  const { state, dispatch } = useApp();
  const { activeRoom, activeMovie, messages, playback, personalSettings, typingUsers, user, currentInsight } = state;
  const [chatInput, setChatInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [reactionBurst, setReactionBurst] = useState(null);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const chatEndRef = useRef(null);
  const participants = (activeRoom?.participants || []).map(id => MOCK_USERS.find(u => u.id === id)).filter(Boolean);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const togglePlay = () => {
    dispatch({
      type: 'SET_PLAYBACK',
      payload: { isPlaying: !playback.isPlaying, lastSyncedBy: user?.id },
    });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        text: `${user?.name} ${playback.isPlaying ? 'paused' : 'resumed'} playback`,
        avatar: user?.avatar, time: 'Just now',
      },
    });
  };

  const seek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    dispatch({ type: 'SET_PLAYBACK', payload: { currentTime: Math.floor(ratio * playback.duration) } });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    dispatch({ type: 'ADD_MESSAGE', payload: { userId: user.id, text: chatInput.trim() } });
    setChatInput('');
  };

  const sendReaction = (emoji) => {
    const id = Date.now();
    setFloatingReactions(fr => [...fr, { id, emoji, x: Math.random() * 60 + 20 }]);
    setTimeout(() => setFloatingReactions(fr => fr.filter(r => r.id !== id)), 2500);
    dispatch({ type: 'ADD_MESSAGE', payload: { userId: user.id, text: emoji, isReaction: true } });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: { text: `${user?.name} reacted ${emoji}`, avatar: user?.avatar, time: 'Just now' },
    });
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
      : `${m}:${String(sec).padStart(2,'0')}`;
  };

  const progressPct = (playback.currentTime / playback.duration) * 100;

  if (!activeRoom || !activeMovie) {
    return <div style={{padding:80,textAlign:'center',color:'var(--text-muted)'}}>No active room. Go back home.</div>;
  }

  return (
    <div className="watch-layout">
      {/* TOP BAR */}
      <div className="watch-topbar">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
        >Back</button>
        <div className="watch-room-info">
          {activeRoom.isLive && <span className="tag tag-red"><div className="live-dot" /> LIVE</span>}
          <span className="watch-room-name">{activeRoom.name}</span>
          <span className="watch-movie-name">— {activeMovie.title}</span>
        </div>
        <div className="watch-top-right">
          <div className="participant-pills" onClick={() => setShowParticipants(v => !v)}>
            {participants.slice(0, 4).map(p => (
              <img key={p.id} src={p.avatar} alt={p.name} className="avatar participant-pill"
                style={{width:28,height:28}} />
            ))}
            <span className="participant-count">{participants.length} watching</span>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dispatch({ type: 'SET_INVITE_MODAL', payload: true })}
          >Invite</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSettings(v => !v)}>Settings</button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="watch-main">
        {/* VIDEO PLAYER */}
        <div className="video-area">
          <div className="video-player">
            {/* Mock video frame */}
            <img src={activeMovie.backdrop} alt={activeMovie.title} className="video-frame" />
            <div className="video-overlay">
              {/* Floating reactions */}
              {floatingReactions.map(r => (
                <div key={r.id} className="floating-reaction" style={{left:`${r.x}%`}}>
                  {r.emoji}
                </div>
              ))}
              {/* Center play icon on toggle */}
              <div className={`play-flash ${playback.isPlaying ? 'hide' : 'show'}`}>PLAY</div>
            </div>

            {/* Controls */}
            <div className="video-controls">
              {/* Progress */}
              <div className="progress-container" onClick={seek} role="slider" aria-label="Progress">
                <div className="video-progress-bg">
                  <div className="video-progress-fill" style={{width:`${progressPct}%`}} />
                  <div className="video-progress-thumb" style={{left:`${progressPct}%`}} />
                </div>
              </div>

              <div className="controls-row">
                <div className="controls-left">
                  <button className="ctrl-btn" onClick={togglePlay}>
                    {playback.isPlaying ? 'PAUSE' : 'PLAY'}
                  </button>
                  <button className="ctrl-btn">NEXT</button>
                  <div className="volume-ctrl">
                    <span>VOL</span>
                    <input
                      type="range" min="0" max="100"
                      value={personalSettings.volume}
                      onChange={e => dispatch({ type: 'SET_PERSONAL_SETTINGS', payload: { volume: +e.target.value } })}
                      className="volume-slider"
                    />
                    <span className="vol-val">{personalSettings.volume}%</span>
                  </div>
                  <span className="time-display">
                    {formatTime(playback.currentTime)} / {formatTime(playback.duration)}
                  </span>
                </div>
                <div className="controls-right">
                  {playback.lastSyncedBy && (
                    <span className="sync-indicator">
                      Synced with {MOCK_USERS.find(u => u.id === playback.lastSyncedBy)?.name?.split(' ')[0]}
                    </span>
                  )}
                  <button className="ctrl-btn" onClick={() => setShowSettings(v => !v)}>SET</button>
                  <button className="ctrl-btn">FULL</button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insight strip */}
          <div className="watch-insight">
            <span>INSIGHT:</span>
            <span>{currentInsight.text}</span>
          </div>

          {/* Reaction Bar */}
          <div className="reaction-bar">
            {REACTIONS.map(emoji => (
              <button key={emoji} className="reaction-btn" onClick={() => sendReaction(emoji)}>
                {emoji}
              </button>
            ))}
            <div className="reaction-divider" />
            <span className="reaction-hint">React to this moment</span>
          </div>
        </div>

        {/* CHAT PANEL */}
        <div className="chat-panel">
          <div className="chat-header">
            <span className="chat-title">Live Chat</span>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div className="live-dot" />
              <span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>Live</span>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => {
              const sender = MOCK_USERS.find(u => u.id === msg.userId);
              const isMe = msg.userId === user?.id;
              return (
                <div key={msg.id || i} className={`chat-msg ${isMe ? 'me' : ''} ${msg.isReaction ? 'reaction-msg' : ''}`}>
                  {!isMe && <img src={sender?.avatar} alt="" className="avatar" style={{width:24,height:24,flexShrink:0}} />}
                  <div className="msg-content">
                    {!isMe && <div className="msg-sender">{sender?.name?.split(' ')[0]}</div>}
                    <div className={`msg-bubble ${isMe ? 'bubble-me' : 'bubble-other'} ${msg.isReaction ? 'bubble-reaction' : ''}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                {MOCK_USERS.find(u => u.id === typingUsers[0])?.name?.split(' ')[0]} is typing
                <span className="typing-dots"><span /><span /><span /></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={sendMessage} className="chat-input-area">
            <div className="emoji-picker-inline">
              {EMOJIS.slice(0, 6).map(e => (
                <button type="button" key={e} className="emoji-quick" onClick={() => setChatInput(v => v + e)}>{e}</button>
              ))}
            </div>
            <div className="chat-input-row">
              <input
                className="input chat-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Say something…"
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={!chatInput.trim()}>SEND</button>
            </div>
          </form>
        </div>
      </div>

      {/* SETTINGS PANEL */}
      {showSettings && (
        <div className="settings-panel animate-slide-right">
          <div className="settings-header">
            <span>Your Settings</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowSettings(false)}>CLOSE</button>
          </div>
          <div className="settings-notice">
            Audio and subtitle settings are personal to your device and do not affect other viewers.
          </div>
          <div className="setting-group">
            <label className="form-label">Audio Language</label>
            <select
              className="select w-full"
              value={personalSettings.audio}
              onChange={e => dispatch({ type: 'SET_PERSONAL_SETTINGS', payload: { audio: e.target.value } })}
            >
              {['English','Spanish','French','German','Japanese','Korean','Hindi','Portuguese'].map(l => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="setting-group">
            <label className="form-label">Subtitles</label>
            <select
              className="select w-full"
              value={personalSettings.subtitles}
              onChange={e => dispatch({ type: 'SET_PERSONAL_SETTINGS', payload: { subtitles: e.target.value } })}
            >
              {['Off','English','Spanish','French','German','Japanese','Korean','Hindi'].map(l => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="setting-group">
            <label className="form-label">Volume: {personalSettings.volume}%</label>
            <input
              type="range" min="0" max="100"
              value={personalSettings.volume}
              onChange={e => dispatch({ type: 'SET_PERSONAL_SETTINGS', payload: { volume: +e.target.value } })}
              style={{width:'100%',accentColor:'var(--primary)'}}
            />
          </div>
        </div>
      )}

      {/* PARTICIPANTS PANEL */}
      {showParticipants && (
        <div className="participants-panel animate-slide-right">
          <div className="settings-header">
            <span>Room Participants</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowParticipants(false)}>CLOSE</button>
          </div>
          {participants.map(p => (
            <div key={p.id} className="participant-row">
              <div style={{position:'relative'}}>
                <img src={p.avatar} alt={p.name} className="avatar" style={{width:36,height:36}} />
                <div className="online-dot" style={{position:'absolute',bottom:0,right:0}} />
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:'0.875rem'}}>{p.name}</div>
                <div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>
                  {p.id === activeRoom.hostId ? 'Host' : 'Viewer'}
                </div>
              </div>
              <div className="live-dot-green" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
