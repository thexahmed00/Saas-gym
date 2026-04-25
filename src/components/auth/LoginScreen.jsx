import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const FIELD = ({ label, children }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{
      display: 'block',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#6b7280',
      marginBottom: '7px',
    }}>{label}</label>
    {children}
  </div>
);

const INPUT_STYLE = {
  width: '100%',
  background: '#0d0d14',
  border: '1px solid #1e1e2e',
  borderRadius: '8px',
  padding: '11px 14px',
  fontSize: '14px',
  color: '#e0e0e8',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
};

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode]    = useState('signin');           // 'signin' | 'signup'
  const [form, setForm]    = useState({ email: '', password: '', gymName: '' });
  const [busy, setBusy]    = useState(false);
  const [error,   setError]   = useState(null);
  const [pending, setPending] = useState(null);            // post-signup confirmation note

  const isSignup = mode === 'signup';

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true); setError(null); setPending(null);

    const { error: err, data } = isSignup
      ? await signUp(form.email, form.password, form.gymName.trim() || 'My Gym')
      : await signIn(form.email, form.password);

    if (err) {
      setError(err.message);
    } else if (isSignup && !data.session) {
      setPending('Check your inbox to confirm your email, then sign in.');
    }
    setBusy(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0f',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '44px',
            letterSpacing: '0.14em',
            lineHeight: 1,
          }}>
            <span style={{ color: '#e94560' }}>IRON</span>
            <span style={{ color: '#f0f0f8' }}>TRACK</span>
          </div>
          <div style={{ fontSize: '11px', color: '#4b5563', letterSpacing: '0.18em', marginTop: '6px' }}>
            GYM MANAGEMENT · HYDERABAD
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#111118',
          border: '1px solid #1e1e2e',
          borderRadius: '16px',
          padding: '28px',
        }}>
          {/* Tab toggle */}
          <div style={{
            display: 'flex',
            background: '#0d0d14',
            border: '1px solid #1e1e2e',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '24px',
          }}>
            {[
              { key: 'signin', label: 'Sign In' },
              { key: 'signup', label: 'Sign Up' },
            ].map(tab => {
              const active = mode === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => { setMode(tab.key); setError(null); setPending(null); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '7px',
                    background: active ? '#e94560' : 'transparent',
                    color: active ? '#fff' : '#9ca3af',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <FIELD label="Gym Name">
                <input
                  style={INPUT_STYLE}
                  value={form.gymName}
                  onChange={e => setForm(f => ({ ...f, gymName: e.target.value }))}
                  placeholder="e.g. IronFit Banjara Hills"
                  autoFocus
                />
              </FIELD>
            )}

            <FIELD label="Email">
              <input
                type="email"
                required
                style={INPUT_STYLE}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="owner@yourgym.in"
                autoFocus={!isSignup}
              />
            </FIELD>

            <FIELD label="Password">
              <input
                type="password"
                required
                minLength={6}
                style={INPUT_STYLE}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="At least 6 characters"
              />
            </FIELD>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(233,69,96,0.1)',
                border: '1px solid rgba(233,69,96,0.3)',
                borderRadius: '8px',
                color: '#e94560',
                fontSize: '13px',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}
            {pending && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: '8px',
                color: '#4ade80',
                fontSize: '13px',
                marginBottom: '16px',
              }}>
                {pending}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={busy}
              style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            >
              {busy
                ? (isSignup ? 'Creating account…' : 'Signing in…')
                : (isSignup ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
        </div>

        <div style={{
          textAlign: 'center',
          color: '#4b5563',
          fontSize: '11px',
          marginTop: '20px',
          letterSpacing: '0.05em',
        }}>
          Secured by Supabase Auth · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
