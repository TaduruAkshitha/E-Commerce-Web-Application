import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import Navbar from '../components/Navbar';

const Cart = () => {
  const { items, removeItem, addItem, total } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
      <Navbar />
      <div style={{ textAlign:'center', marginTop:'120px' }}>
        <div style={{ fontSize:'64px', marginBottom:'16px' }}>🛒</div>
        <h2 style={{ color:'#1a1a2e', fontSize:'24px', fontWeight:'700', margin:'0 0 8px' }}>Your cart is empty</h2>
        <p style={{ color:'#888', fontSize:'15px', margin:'0 0 24px' }}>Add some products to get started</p>
        <button onClick={() => navigate('/')}
          style={{ padding:'12px 32px', background:'#e94560', color:'white', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'600', cursor:'pointer' }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
      <Navbar />
      <div style={{ maxWidth:'900px', margin:'40px auto', padding:'0 24px', display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px' }}>

        <div>
          <div style={{ marginBottom:'24px' }}>
            <h1 style={{ fontSize:'28px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 4px' }}>Your Cart</h1>
            <p style={{ color:'#888', fontSize:'15px', margin:'0' }}>{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>
          </div>

          {items.map(item => (
            <div key={item._id} style={{ background:'white', borderRadius:'16px', padding:'20px', marginBottom:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', display:'flex', gap:'16px', alignItems:'center' }}>
              <div style={{ width:'80px', height:'80px', borderRadius:'12px', overflow:'hidden', flexShrink:0, background:'#f5f5f5' }}>
                {item.images?.[0]
                  ? <img src={item.images[0]} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px' }}>🛍</div>
                }
              </div>
              <div style={{ flex:1 }}>
                <h3 style={{ margin:'0 0 4px', fontSize:'16px', fontWeight:'600', color:'#1a1a2e' }}>{item.name}</h3>
                <p style={{ margin:'0 0 12px', color:'#888', fontSize:'13px' }}>{item.category}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ display:'flex', alignItems:'center', background:'#f8f9fa', borderRadius:'10px', padding:'4px' }}>
                    <button onClick={() => removeItem(item._id)}
                      style={{ width:'32px', height:'32px', border:'none', borderRadius:'8px', background:'#e94560', color:'white', fontSize:'18px', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      −
                    </button>
                    <span style={{ padding:'0 16px', fontWeight:'600', fontSize:'15px', color:'#1a1a2e' }}>{item.qty}</span>
                    <button onClick={() => addItem(item)}
                      style={{ width:'32px', height:'32px', border:'none', borderRadius:'8px', background:'#1a1a2e', color:'white', fontSize:'18px', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      +
                    </button>
                  </div>
                  <span style={{ fontWeight:'700', fontSize:'16px', color:'#e94560' }}>₹{item.price * item.qty}</span>
                </div>
              </div>
              <button onClick={() => removeItem(item._id)}
                style={{ background:'#fff0f0', color:'#e74c3c', border:'none', padding:'8px 14px', borderRadius:'10px', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div>
          <div style={{ background:'white', borderRadius:'20px', padding:'24px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', position:'sticky', top:'100px' }}>
            <h2 style={{ margin:'0 0 20px', fontSize:'18px', fontWeight:'700', color:'#1a1a2e' }}>Order Summary</h2>
            <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:'16px' }}>
              {items.map(item => (
                <div key={item._id} style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                  <span style={{ color:'#888', fontSize:'14px' }}>{item.name} x{item.qty}</span>
                  <span style={{ fontWeight:'500', fontSize:'14px', color:'#1a1a2e' }}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop:'2px solid #f0f0f0', marginTop:'16px', paddingTop:'16px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <span style={{ fontWeight:'700', fontSize:'18px', color:'#1a1a2e' }}>Total</span>
              <span style={{ fontWeight:'700', fontSize:'22px', color:'#e94560' }}>₹{total()}</span>
            </div>
            <button onClick={() => navigate('/checkout')}
              style={{ width:'100%', padding:'14px', background:'#e94560', color:'white', border:'none', borderRadius:'12px', fontSize:'16px', fontWeight:'700', cursor:'pointer' }}
              onMouseEnter={e => e.target.style.background='#c73652'}
              onMouseLeave={e => e.target.style.background='#e94560'}>
              Proceed to Checkout →
            </button>
            <button onClick={() => navigate('/')}
              style={{ width:'100%', padding:'12px', background:'transparent', color:'#888', border:'1px solid #e0e0e0', borderRadius:'12px', fontSize:'14px', fontWeight:'500', cursor:'pointer', marginTop:'12px' }}>
              Continue Shopping
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;