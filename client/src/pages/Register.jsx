import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth:'400px', margin:'80px auto', padding:'32px', border:'1px solid #ddd', borderRadius:'12px' }}>
      <h2 style={{ marginBottom:'24px', textAlign:'center' }}>Register</h2>
      {error && <p style={{ color:'red', marginBottom:'12px' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text" placeholder="Full Name"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          style={{ width:'100%', padding:'10px', marginBottom:'12px', borderRadius:'6px', border:'1px solid #ddd' }}
        />
        <input
          type="email" placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          style={{ width:'100%', padding:'10px', marginBottom:'12px', borderRadius:'6px', border:'1px solid #ddd' }}
        />
        <input
          type="password" placeholder="Password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          style={{ width:'100%', padding:'10px', marginBottom:'16px', borderRadius:'6px', border:'1px solid #ddd' }}
        />
        <button type="submit" style={{ width:'100%', padding:'10px', background:'#1a1a2e', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'16px' }}>
          Register
        </button>
      </form>
      <p style={{ textAlign:'center', marginTop:'16px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;