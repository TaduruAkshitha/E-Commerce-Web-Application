// ─────────────────────────── LOGIN.JSX ───────────────────────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', form);
      login(data.user, data.token);
      toast.success('Welcome back!', {
        style: { borderRadius: '12px', background: '#1a1a2e', color: '#fff' }
      });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed', {
        style: { borderRadius: '12px' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 48, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(233,69,96,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(233,69,96,0.04)' }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 400 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #e94560, #c73652)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(233,69,96,0.35)',
            }}>
              <span style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>S</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: 'white' }}>ShopApp</span>
          </Link>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
            Your favorite<br />store awaits
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.6 }}>
            Thousands of products. Amazing prices. Fast delivery.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 48, textAlign: 'left' }}>
            {['🛍️  Shop from 500+ products', '🔐  Secure checkout & payments', '📦  Fast delivery tracking', '⭐  4.9 star rated service'].map(item => (
              <div key={item} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        width: 480, background: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 56px',
        borderRadius: '32px 0 0 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ color: '#9ca3af', fontSize: 15 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</label>
              <input
                type="email" required
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '1.5px solid #e5e7eb', borderRadius: 12,
                  fontSize: 15, outline: 'none', fontFamily: "'DM Sans', sans-serif",
                  color: '#1a1a2e', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#e94560'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%', padding: '13px 48px 13px 16px',
                    border: '1.5px solid #e5e7eb', borderRadius: 12,
                    fontSize: 15, outline: 'none', fontFamily: "'DM Sans', sans-serif",
                    color: '#1a1a2e', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e94560'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 13,
                }}>{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? '#f3f4f6' : 'linear-gradient(135deg, #e94560, #c73652)',
              color: loading ? '#9ca3af' : 'white',
              border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              boxShadow: loading ? 'none' : '0 6px 20px rgba(233,69,96,0.3)',
              transition: 'all 0.2s',
            }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
