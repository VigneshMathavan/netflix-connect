// =============================================
//  PAYMENT / SUBSCRIPTION SCREEN
// =============================================
import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { SUBSCRIPTIONS } from '../data/mockData';
import './Payment.css';

const PLANS = Object.values(SUBSCRIPTIONS);

export default function PaymentScreen() {
  const { state, dispatch } = useApp();
  const { user } = state;
  const [selectedPlan, setSelectedPlan] = useState(user?.subscription || 'premium');
  const [step, setStep] = useState('plans'); // plans | checkout | success
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const current = SUBSCRIPTIONS[user?.subscription];

  const handleCheckout = async (e) => {
    e.preventDefault();
    setProcessing(true);
    await delay(2000);
    dispatch({ type: 'UPGRADE_SUBSCRIPTION', payload: selectedPlan });
    dispatch({
      type: 'SET_TOAST',
      payload: { msg: `🎉 Upgraded to ${SUBSCRIPTIONS[selectedPlan].name}!`, type: 'success' },
    });
    setStep('success');
    setProcessing(false);
  };

  if (step === 'success') {
    const plan = SUBSCRIPTIONS[selectedPlan];
    return (
      <div className="payment-container">
        <div className="payment-success animate-scale">
          <div className="success-icon">🎉</div>
          <h2>You're on {plan.name}!</h2>
          <p>Your subscription has been upgraded. Enjoy all the new Connect features.</p>
          <div className="success-features">
            {plan.connectFeatures.map(f => (
              <div key={f} className="success-feature">✅ {f}</div>
            ))}
          </div>
          <button className="btn btn-primary btn-xl" onClick={() => { dispatch({ type: 'SET_VIEW', payload: 'home' }); setStep('plans'); }}>
            Start Watching 🎬
          </button>
        </div>
      </div>
    );
  }

  if (step === 'checkout') {
    const plan = SUBSCRIPTIONS[selectedPlan];
    return (
      <div className="payment-container">
        <div className="checkout-card animate-scale">
          <button className="btn btn-ghost btn-sm" onClick={() => setStep('plans')} style={{marginBottom:24}}>← Back to Plans</button>
          <h2 className="checkout-title">Upgrade to {plan.name}</h2>
          <div className="checkout-summary">
            <span>{plan.name} Plan</span>
            <span className="checkout-price">${plan.price}/mo</span>
          </div>
          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                className="input" placeholder="4242 4242 4242 4242" required
                value={cardNum}
                onChange={e => setCardNum(e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19))}
              />
            </div>
            <div className="checkout-row">
              <div className="form-group" style={{flex:1}}>
                <label className="form-label">Expiry</label>
                <input className="input" placeholder="MM/YY" required maxLength={5}
                  value={expiry} onChange={e => setExpiry(e.target.value)} />
              </div>
              <div className="form-group" style={{flex:1}}>
                <label className="form-label">CVV</label>
                <input className="input" placeholder="•••" required maxLength={4} type="password"
                  value={cvv} onChange={e => setCvv(e.target.value)} />
              </div>
            </div>
            <div className="checkout-trust">
              🔒 Secured with 256-bit SSL encryption · Cancel anytime
            </div>
            <button type="submit" className="btn btn-primary btn-xl w-full" disabled={processing}>
              {processing ? (
                <><span className="animate-spin">⟳</span> Processing…</>
              ) : `Pay $${plan.price}/month`}
            </button>
          </form>
          <div className="demo-note">💡 Demo mode: any card details will work</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header animate-fade">
        <div className="tag tag-gold" style={{display:'inline-flex',gap:6,alignItems:'center',marginBottom:16}}>
          ⭐ Netflix Connect Plans
        </div>
        <h1 className="payment-title">Upgrade your experience</h1>
        <p className="payment-subtitle">Choose the plan that unlocks the right Connect features for you.</p>
        {current && (
          <div className="current-plan-badge">
            Current plan: <strong>{current.name}</strong>
          </div>
        )}
      </div>

      <div className="plans-grid animate-fade">
        {PLANS.map(plan => {
          const isCurrentPlan = plan.id === user?.subscription;
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`plan-card ${isSelected ? 'selected' : ''} ${isCurrentPlan ? 'current' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.id === 'premium' && <div className="plan-popular-badge">Most Popular</div>}
              {isCurrentPlan && <div className="plan-current-badge">Current</div>}

              <div className="plan-header">
                <div className="plan-name" style={{color: plan.color}}>{plan.name}</div>
                <div className="plan-price">
                  <span className="price-dollar">$</span>
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-per">/mo</span>
                </div>
              </div>

              <div className="plan-features">
                <div className="plan-section-label">Plan Features</div>
                {plan.features.map(f => (
                  <div key={f} className="plan-feature">✓ {f}</div>
                ))}
              </div>

              {plan.connectFeatures.length > 0 && (
                <div className="plan-connect-features">
                  <div className="plan-section-label" style={{color:'var(--primary)'}}>🔗 Connect Features</div>
                  {plan.connectFeatures.map(f => (
                    <div key={f} className="plan-feature connect-feature">✦ {f}</div>
                  ))}
                </div>
              )}

              {plan.connectFeatures.length === 0 && (
                <div className="plan-no-connect">✗ No Connect access</div>
              )}

              {isCurrentPlan ? (
                <div className="btn btn-ghost btn-lg w-full" style={{justifyContent:'center',opacity:0.5,cursor:'default'}}>
                  Current Plan
                </div>
              ) : (
                <button
                  className={`btn btn-lg w-full ${plan.id === 'premium_plus' ? 'btn-gold' : 'btn-primary'}`}
                  style={{justifyContent:'center'}}
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan.id); setStep('checkout'); }}
                >
                  {plan.price < (current?.price || 0) ? 'Downgrade' : 'Upgrade'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="comparison-table animate-fade">
        <h3 className="section-title">📊 Feature Comparison</h3>
        <div className="comp-grid">
          <div className="comp-header">Feature</div>
          {PLANS.map(p => <div key={p.id} className="comp-header" style={{color:p.color}}>{p.name}</div>)}

          {[
            { label: 'Join Watch Rooms', key: 'canJoinRooms' },
            { label: 'Create Rooms', key: 'canCreateRooms' },
            { label: 'Invite Friends', key: 'canInvite' },
            { label: 'Creator Access', key: 'hasCreatorAccess' },
            { label: 'AI Insights', key: 'hasAIInsights' },
          ].map(row => (
            <>
              <div key={row.label} className="comp-cell comp-label">{row.label}</div>
              {PLANS.map(p => (
                <div key={p.id} className="comp-cell">
                  {p[row.key] ? '✅' : '—'}
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

const delay = ms => new Promise(r => setTimeout(r, ms));
