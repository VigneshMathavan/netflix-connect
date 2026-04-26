// =============================================
//  NAVBAR
// =============================================
import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { SUBSCRIPTIONS } from '../data/mockData';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home',      label: 'Home',         icon: '🏠' },
  { id: 'friends',   label: 'Friends',      icon: '👥' },
  { id: 'creator',   label: 'Creator Hub',  icon: '🎬' },
  { id: 'dashboard', label: 'Live Stats',   icon: '📊' },
  { id: 'payment',   label: 'Upgrade',      icon: '⭐' },
];

export default function Navbar() {
  const { state, dispatch } = useApp();
  const { user, view, systemStats } = state;
  const [showProfile, setShowProfile] = useState(false);
  const sub = SUBSCRIPTIONS[user?.subscription] || SUBSCRIPTIONS.basic;

  const navigate = (v) => {
    dispatch({ type: 'SET_VIEW', payload: v });
    setShowProfile(false);
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    setShowProfile(false);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => navigate('home')} role="button">
        <span className="nav-n">N</span>
        <span className="nav-connect">CONNECT</span>
      </div>

      {/* Nav items */}
      <div className="navbar-links">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-link ${view === item.id ? 'active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'payment' && user?.subscription !== 'premium_plus' && (
              <span className="nav-badge">✦</span>
            )}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="navbar-right">
        {/* Live indicator */}
        <div className="nav-live-pill">
          <div className="live-dot" />
          <span>{systemStats.usersOnline.toLocaleString()} online</span>
        </div>

        {/* Profile */}
        <div className="nav-profile" onClick={() => setShowProfile(v => !v)}>
          <img src={user?.avatar} alt={user?.name} className="avatar" />
          <div className={`nav-sub-badge tier-${user?.subscription}`}>{sub.name}</div>
        </div>

        {showProfile && (
          <div className="profile-dropdown animate-scale">
            <div className="profile-header">
              <img src={user?.avatar} alt="" className="avatar" style={{width:48,height:48}} />
              <div>
                <div className="profile-name">{user?.name}</div>
                <div className="profile-email">{user?.email}</div>
                <div className={`profile-tier tier-${user?.subscription}`}>{sub.name} Member</div>
              </div>
            </div>
            <hr className="divider" />
            <button className="profile-menu-item" onClick={() => navigate('payment')}>⭐ Upgrade Plan</button>
            <button className="profile-menu-item" onClick={() => navigate('friends')}>👥 Friends</button>
            <button className="profile-menu-item danger" onClick={logout}>🚪 Sign Out</button>
          </div>
        )}
      </div>
    </nav>
  );
}
