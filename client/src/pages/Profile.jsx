import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login, token } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    pincode: user?.address?.pincode || ''
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        address: { street: form.street, city: form.city, pincode: form.pincode }
      });
      login(data.user, token);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    border: '2px solid #f0f0f0',
    fontSize: '15px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    color: '#1a1a2e',
    background: '#fafafa'
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
      <Navbar />
      <div style={{ maxWidth:'600px', margin:'40px auto', padding:'0 24px' }}>

        <div style={{ background:'white', borderRadius:'20px', padding:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'20px' }}>
          <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'linear-gradient(135deg, #e94560, #0f3460)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:'700', color:'white', flexShrink:0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin:'0 0 4px', fontSize:'22px', fontWeight:'700', color:'#1a1a2e' }}>{user?.name}</h2>
            <p style={{ margin:'0 0 4px', color:'#888', fontSize:'14px' }}>{user?.email}</p>
            <span style={{ background: user?.role === 'admin' ? '#fff0f5' : '#f0f7ff', color: user?.role === 'admin' ? '#e94560' : '#0f3460', padding:'3px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' }}>
              {user?.role === 'admin' ? 'Admin' : 'Customer'}
            </span>
          </div>
        </div>

        <div style={{ background:'white', borderRadius:'20px', padding:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', marginBottom:'24px' }}>
          <h3 style={{ margin:'0 0 24px', fontSize:'18px', fontWeight:'700', color:'#1a1a2e' }}>Personal Information</h3>
          <label style={{ fontSize:'12px', fontWeight:'700', color:'#999', display:'block', marginBottom:'8px', letterSpacing:'1px' }}>FULL NAME</label>
          <input
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            style={inputStyle}
            onFocus={e => { e.target.style.border='2px solid #e94560'; e.target.style.background='#fff'; }}
            onBlur={e => { e.target.style.border='2px solid #f0f0f0'; e.target.style.background='#fafafa'; }}
          />
          <label style={{ fontSize:'12px', fontWeight:'700', color:'#999', display:'block', marginBottom:'8px', letterSpacing:'1px' }}>EMAIL ADDRESS</label>
          <input
            value={form.email}
            disabled
            style={{ ...inputStyle, background:'#f5f5f5', color:'#aaa', cursor:'not-allowed' }}
          />
        </div>

        <div style={{ background:'white', borderRadius:'20px', padding:'32px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', marginBottom:'24px' }}>
          <h3 style={{ margin:'0 0 24px', fontSize:'18px', fontWeight:'700', color:'#1a1a2e' }}>Shipping Address</h3>
          <label style={{ fontSize:'12px', fontWeight:'700', color:'#999', display:'block', marginBottom:'8px', letterSpacing:'1px' }}>STREET</label>
          <input
            placeholder="Street address"
            value={form.street}
            onChange={e => setForm({...form, street: e.target.value})}
            style={inputStyle}
            onFocus={e => { e.target.style.border='2px solid #e94560'; e.target.style.background='#fff'; }}
            onBlur={e => { e.target.style.border='2px solid #f0f0f0'; e.target.style.background='#fafafa'; }}
          />
          <label style={{ fontSize:'12px', fontWeight:'700', color:'#999', display:'block', marginBottom:'8px', letterSpacing:'1px' }}>CITY</label>
          <input
            placeholder="City"
            value={form.city}
            onChange={e => setForm({...form, city: e.target.value})}
            style={inputStyle}
            onFocus={e => { e.target.style.border='2px solid #e94560'; e.target.style.background='#fff'; }}
            onBlur={e => { e.target.style.border='2px solid #f0f0f0'; e.target.style.background='#fafafa'; }}
          />
          <label style={{ fontSize:'12px', fontWeight:'700', color:'#999', display:'block', marginBottom:'8px', letterSpacing:'1px' }}>PINCODE</label>
          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={e => setForm({...form, pincode: e.target.value})}
            style={{ ...inputStyle, marginBottom:0 }}
            onFocus={e => { e.target.style.border='2px solid #e94560'; e.target.style.background='#fff'; }}
            onBlur={e => { e.target.style.border='2px solid #f0f0f0'; e.target.style.background='#fafafa'; }}
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          style={{ width:'100%', padding:'15px', background: loading ? '#ccc' : '#e94560', color:'white', border:'none', borderRadius:'12px', fontSize:'16px', fontWeight:'700', cursor: loading ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if(!loading) e.target.style.background='#c73652'; }}
          onMouseLeave={e => { if(!loading) e.target.style.background='#e94560'; }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default Profile;