import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useCartStore from '../store/useCartStore';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, total, clear } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [form, setForm] = useState({ street: '', city: '', pincode: '' });

  if (items.length === 0) { navigate('/'); return null; }

  const inputStyle = (name) => ({
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: focused === name ? '2px solid #e94560' : '2px solid #e8e8e8',
    fontSize: '15px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    background: '#fff',
    color: '#1a1a2e',
    transition: 'border 0.2s'
  });

  const handleOrder = async () => {
    if (!form.street || !form.city || !form.pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/orders', {
        items: items.map(i => ({ product: i._id, qty: i.qty })),
        shippingAddress: form
      });
      clear();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error('Failed to place order');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
      <Navbar />
      <div style={{ maxWidth:'900px', margin:'40px auto', padding:'0 24px', display:'grid', gridTemplateColumns:'1fr 380px', gap:'24px' }}>

        <div>
          <h2 style={{ fontSize:'24px', fontWeight:'700', color:'#1a1a2e', marginBottom:'24px' }}>Shipping Address</h2>
          <div style={{ background:'white', borderRadius:'16px', padding:'28px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <label style={{ fontSize:'13px', fontWeight:'600', color:'#666', display:'block', marginBottom:'6px' }}>STREET ADDRESS</label>
            <input
              placeholder="e.g. 123 MG Road"
              value={form.street}
              onChange={e => setForm({...form, street: e.target.value})}
              onFocus={() => setFocused('street')}
              onBlur={() => setFocused('')}
              style={inputStyle('street')}
            />
            <label style={{ fontSize:'13px', fontWeight:'600', color:'#666', display:'block', marginBottom:'6px' }}>CITY</label>
            <input
              placeholder="e.g. Hyderabad"
              value={form.city}
              onChange={e => setForm({...form, city: e.target.value})}
              onFocus={() => setFocused('city')}
              onBlur={() => setFocused('')}
              style={inputStyle('city')}
            />
            <label style={{ fontSize:'13px', fontWeight:'600', color:'#666', display:'block', marginBottom:'6px' }}>PINCODE</label>
            <input
              placeholder="e.g. 500001"
              value={form.pincode}
              onChange={e => setForm({...form, pincode: e.target.value})}
              onFocus={() => setFocused('pincode')}
              onBlur={() => setFocused('')}
              style={{ ...inputStyle('pincode'), marginBottom: 0 }}
            />
          </div>
        </div>

        <div>
          <h2 style={{ fontSize:'24px', fontWeight:'700', color:'#1a1a2e', marginBottom:'24px' }}>Order Summary</h2>
          <div style={{ background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            {items.map(item => (
              <div key={item._id} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f5f5f5' }}>
                <div>
                  <p style={{ margin:'0', fontWeight:'500', fontSize:'14px', color:'#1a1a2e' }}>{item.name}</p>
                  <p style={{ margin:'4px 0 0', color:'#aaa', fontSize:'13px' }}>Qty: {item.qty}</p>
                </div>
                <p style={{ margin:'0', fontWeight:'600', color:'#1a1a2e' }}>₹{item.price * item.qty}</p>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:'16px', paddingTop:'16px', borderTop:'2px solid #f0f0f0' }}>
              <span style={{ fontWeight:'700', fontSize:'18px', color:'#1a1a2e' }}>Total</span>
              <span style={{ fontWeight:'700', fontSize:'18px', color:'#e94560' }}>₹{total()}</span>
            </div>
            <button
              onClick={handleOrder}
              disabled={loading}
              onMouseEnter={e => { if(!loading) e.target.style.background='#c73652'; }}
              onMouseLeave={e => { if(!loading) e.target.style.background='#e94560'; }}
              style={{ width:'100%', padding:'14px', marginTop:'20px', background: loading ? '#ccc' : '#e94560', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'600', cursor: loading ? 'not-allowed' : 'pointer', transition:'background 0.2s', letterSpacing:'0.5px' }}>
              {loading ? 'Placing Order...' : '🛒 Place Order'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;