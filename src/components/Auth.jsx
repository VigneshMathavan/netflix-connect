// =============================================
//  AUTH SCREEN – Login / Signup
// =============================================
import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { MOCK_USERS } from '../data/mockData';
import './Auth.css';

export default function AuthScreen() {
  const { dispatch } = useApp();
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await delay(800);
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      setError('Invalid email or password. Try alex@example.com / demo123');
      setLoading(false); return;
    }
    dispatch({ type: 'LOGIN', payload: user });
    dispatch({ type: 'SET_TOAST', payload: { msg: `Welcome back, ${user.name}! 👋`, type: 'success' } });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await delay(1000);
    if (!name || !email || !password) {
      setError('Please fill in all fields.'); setLoading(false); return;
    }
    // Create demo user
    const newUser = {
      ...MOCK_USERS[0],
      id: 'u_new',
      name, email, password,
      subscription: 'basic',
      friends: ['u2', 'u3'],
    };
    dispatch({ type: 'LOGIN', payload: newUser });
    dispatch({ type: 'SET_TOAST', payload: { msg: `Account created! Welcome, ${name}! 🎉`, type: 'success' } });
  };

  const quickLogin = (user) => {
    dispatch({ type: 'LOGIN', payload: user });
    dispatch({ type: 'SET_TOAST', payload: { msg: `Welcome back, ${user.name}! 👋`, type: 'success' } });
  };

  return (
    <div className="auth-container">
      {/* Background gradient blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-content animate-fade">
        {/* Logo */}
        <div className="auth-logo">
          <span className="logo-n">N</span>
          <span className="logo-connect">CONNECT</span>
        </div>
        <p className="auth-tagline">Watch together. Experience together.</p>

        {/* Card */}
        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >Sign In</button>
            <button
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); }}
            >Create Account</button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="auth-form">
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="input" type="text" placeholder="Your name"
                  value={name} onChange={e => setName(e.target.value)} required
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="input" type="email" placeholder="email@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? <span className="animate-spin">⟳</span> : null}
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>Quick Demo Login</span></div>

          <div className="quick-login-grid">
            {MOCK_USERS.slice(0, 4).map(u => (
              <button key={u.id} className="quick-login-card" onClick={() => quickLogin(u)}>
                <img src={u.avatar} alt={u.name} className="avatar" style={{width:40,height:40}} />
                <div>
                  <div className="quick-name">{u.name}</div>
                  <div className={`quick-tier tier-${u.subscription}`}>
                    {u.subscription.replace('_', '+')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features preview */}
        <div className="auth-features">
          {[
            { icon: '🎬', text: 'Watch parties' },
            { icon: '💬', text: 'Live chat' },
            { icon: '👥', text: 'Friend rooms' },
            { icon: '🌟', text: 'Creator events' },
          ].map(f => (
            <div key={f.text} className="auth-feature">
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const delay = ms => new Promise(r => setTimeout(r, ms));
