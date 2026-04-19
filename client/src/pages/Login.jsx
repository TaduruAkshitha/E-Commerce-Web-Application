import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>🛍</div>
          <h1 style={{ color:'white', fontSize:'28px', fontWeight:'700', margin:'0 0 8px' }}>ShopApp</h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'15px', margin:'0' }}>Welcome back! Login to continue.</p>
        </div>
        <div style={{ background:'white', borderRadius:'24px', padding:'40px', boxShadow:'0 25px 60px rgba(0,0,0,0.4)' }}>
          <h2 style={{ margin:'0 0 28px', fontSize:'22px', fontWeight:'700', color:'#1a1a2e' }}>Login to your account</h2>
          {error && (
            <div style={{ background:'#fff0f0', color:'#e74c3c', padding:'12px 16px', borderRadius:'10px', marginBottom:'20px', fontSize:'14px', border:'1px solid #ffd0d0' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize:'12px', fontWeight:'700', color:'#999', display:'block', marginBottom:'8px', letterSpacing:'1px', textAlign:'left' }}>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              style={{ width:'100%', padding:'14px 16px', borderRadius:'12px', border:'2px solid #f0f0f0', fontSize:'15px', marginBottom:'20px', boxSizing:'border-box', outline:'none', color:'#1a1a2e', background:'#fafafa' }}
              onFocus={e => { e.target.style.border='2px solid #e94560'; e.target.style.background='#fff'; }}
              onBlur={e => { e.target.style.border='2px solid #f0f0f0'; e.target.style.background='#fafafa'; }}
            />
            <label style={{ fontSize:'12px', fontWeight:'700', color:'#999', display:'block', marginBottom:'8px', letterSpacing:'1px',textAlign:'left' }}>PASSWORD</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              style={{ width:'100%', padding:'14px 16px', borderRadius:'12px', border:'2px solid #f0f0f0', fontSize:'15px', marginBottom:'28px', boxSizing:'border-box', outline:'none', color:'#1a1a2e', background:'#fafafa' }}
              onFocus={e => { e.target.style.border='2px solid #e94560'; e.target.style.background='#fff'; }}
              onBlur={e => { e.target.style.border='2px solid #f0f0f0'; e.target.style.background='#fafafa'; }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ width:'100%', padding:'15px', background: loading ? '#ccc' : '#e94560', color:'white', border:'none', borderRadius:'12px', fontSize:'16px', fontWeight:'700', cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if(!loading) e.target.style.background='#c73652'; }}
              onMouseLeave={e => { if(!loading) e.target.style.background='#e94560'; }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div style={{ textAlign:'center', marginTop:'24px', paddingTop:'24px', borderTop:'1px solid #f0f0f0' }}>
            <p style={{ color:'#888', fontSize:'14px', margin:'0' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'#e94560', fontWeight:'700', textDecoration:'none' }}>Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;