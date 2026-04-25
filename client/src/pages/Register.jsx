import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/register', {
        name: form.name, email: form.email, password: form.password
      });
      login(data.user, data.token);
      toast.success('Account created! Welcome 🎉', {
        style: { borderRadius: '12px', background: '#1a1a2e', color: '#fff' }
      });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    }}>
      {/* Left Branding Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 48, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(233,69,96,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(233,69,96,0.04)' }} />

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
            Join thousands of<br />happy shoppers
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.6 }}>
            Create your free account and start shopping in seconds.
          </p>

          <div style={{
            marginTop: 48, background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '24px 28px', textAlign: 'left'
          }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' }}>What you get</div>
            {[
              ['🎁', 'Free account forever'],
              ['🛒', 'Instant cart & checkout'],
              ['📦', 'Order tracking'],
              ['🔒', 'Secure & private'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{
        width: 500, background: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 56px',
        borderRadius: '32px 0 0 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
              Create account
            </h1>
            <p style={{ color: '#9ca3af', fontSize: 15 }}>
              Already have one?{' '}
              <Link to="/login" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Akshitha Taduru' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                <input
                  type={type} required placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '1.5px solid #e5e7eb', borderRadius: 12,
                    fontSize: 15, outline: 'none', fontFamily: "'DM Sans', sans-serif", color: '#1a1a2e',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e94560'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            ))}

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 48px 12px 16px',
                    border: '1.5px solid #e5e7eb', borderRadius: 12,
                    fontSize: 15, outline: 'none', fontFamily: "'DM Sans', sans-serif", color: '#1a1a2e',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e94560'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 12, fontWeight: 600,
                }}>{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirm Password</label>
              <input
                type="password" required
                placeholder="Repeat password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                style={{
                  width: '100%', padding: '12px 16px',
                  border: `1.5px solid ${form.confirm && form.confirm !== form.password ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: 12, fontSize: 15, outline: 'none',
                  fontFamily: "'DM Sans', sans-serif", color: '#1a1a2e',
                }}
                onFocus={e => e.target.style.borderColor = '#e94560'}
                onBlur={e => e.target.style.borderColor = (form.confirm !== form.password ? '#ef4444' : '#e5e7eb')}
              />
              {form.confirm && form.confirm !== form.password && (
                <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>Passwords don't match</p>
              )}
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
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 20 }}>
              By signing up, you agree to our Terms & Privacy Policy
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
