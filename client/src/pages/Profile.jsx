// ─────────────────────────── PROFILE.JSX ───────────────────────────
import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, login, logout } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('profile');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put('/auth/profile', form);
      login(data.user, localStorage.getItem('token'));
      toast.success('Profile updated!', { style: { borderRadius: '12px', background: '#1a1a2e', color: '#fff' } });
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f7f4' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>

        {/* Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: 24, padding: '40px 40px 32px',
          marginBottom: 28, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(233,69,96,0.07)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #e94560, #c73652)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 700, color: 'white',
              boxShadow: '0 8px 24px rgba(233,69,96,0.4)',
              border: '3px solid rgba(255,255,255,0.15)',
            }}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 6 }}>{user?.name}</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 10 }}>{user?.email}</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: user?.role === 'admin' ? 'rgba(233,69,96,0.2)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${user?.role === 'admin' ? 'rgba(233,69,96,0.4)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 100, padding: '4px 14px',
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: user?.role === 'admin' ? '#e94560' : 'rgba(255,255,255,0.7)' }}>
                  {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['profile', 'security'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 24px', borderRadius: 10, cursor: 'pointer',
              border: '1.5px solid', fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
              background: tab === t ? '#1a1a2e' : 'white',
              color: tab === t ? 'white' : '#6b7280',
              borderColor: tab === t ? '#1a1a2e' : '#e5e7eb',
            }}>{t === 'profile' ? '👤 Profile' : '🔒 Security'}</button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', padding: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 28 }}>Edit Profile</h2>
            <form onSubmit={handleUpdate}>
              {[['name', 'Full Name', 'text', 'Your full name'], ['email', 'Email Address', 'email', 'your@email.com']].map(([key, label, type, placeholder]) => (
                <div key={key} style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                  <input
                    type={type} placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{
                      width: '100%', padding: '13px 16px',
                      border: '1.5px solid #e5e7eb', borderRadius: 12,
                      fontSize: 15, outline: 'none', fontFamily: "'DM Sans', sans-serif", color: '#1a1a2e',
                    }}
                    onFocus={e => e.target.style.borderColor = '#e94560'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{
                padding: '13px 32px',
                background: 'linear-gradient(135deg, #e94560, #c73652)',
                color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer',
                fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 4px 16px rgba(233,69,96,0.3)', transition: 'all 0.2s',
              }}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', padding: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Account Security</h2>
            <p style={{ color: '#9ca3af', marginBottom: 32 }}>Manage your account security settings</p>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#dc2626', marginBottom: 8 }}>Danger Zone</h3>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>Once you log out, you'll need to sign in again.</p>
              <button onClick={handleLogout} style={{
                padding: '11px 24px', background: '#dc2626', color: 'white',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              }}>Sign Out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
