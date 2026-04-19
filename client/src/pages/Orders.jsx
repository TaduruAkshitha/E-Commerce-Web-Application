import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const statusColor = {
  pending:    { bg:'#fff8e6', color:'#f39c12', border:'#fdecc8' },
  processing: { bg:'#e8f4fd', color:'#3498db', border:'#bde0f7' },
  shipped:    { bg:'#f3eafd', color:'#9b59b6', border:'#dfc8f7' },
  delivered:  { bg:'#e8fdf0', color:'#2ecc71', border:'#b8f0d0' },
  cancelled:  { bg:'#fde8e8', color:'#e74c3c', border:'#f7c8c8' }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then(res => setOrders(res.data));
  }, []);

  if (orders.length === 0) return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
      <Navbar />
      <div style={{ textAlign:'center', marginTop:'120px' }}>
        <div style={{ fontSize:'64px', marginBottom:'16px' }}>📦</div>
        <h2 style={{ color:'#1a1a2e', fontSize:'24px', fontWeight:'700', margin:'0 0 8px' }}>No orders yet</h2>
        <p style={{ color:'#888', fontSize:'15px' }}>Start shopping to see your orders here</p>
        <button onClick={() => window.location.href='/'} style={{ marginTop:'24px', padding:'12px 28px', background:'#e94560', color:'white', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'600', cursor:'pointer' }}>
          Shop Now
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
      <Navbar />
      <div style={{ maxWidth:'800px', margin:'40px auto', padding:'0 24px' }}>
        <div style={{ marginBottom:'32px' }}>
          <h1 style={{ fontSize:'28px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 4px' }}>My Orders</h1>
          <p style={{ color:'#888', fontSize:'15px', margin:'0' }}>{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>
        </div>

        {orders.map(order => {
          const s = statusColor[order.status] || statusColor.pending;
          return (
            <div key={order._id} style={{ background:'white', borderRadius:'20px', padding:'24px', marginBottom:'20px', boxShadow:'0 2px 16px rgba(0,0,0,0.07)', border:'1px solid #f0f0f0' }}>
              
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
                <div>
                  <p style={{ margin:'0 0 4px', fontSize:'12px', color:'#aaa', fontWeight:'600', letterSpacing:'1px' }}>ORDER ID</p>
                  <p style={{ margin:'0', fontSize:'13px', color:'#555', fontFamily:'monospace' }}>{order._id}</p>
                </div>
                <span style={{ background: s.bg, color: s.color, border:`1px solid ${s.border}`, padding:'6px 16px', borderRadius:'20px', fontSize:'13px', fontWeight:'700' }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div style={{ background:'#f8f9fa', borderRadius:'12px', padding:'16px', marginBottom:'20px' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i < order.items.length - 1 ? '1px solid #eee' : 'none' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:'36px', height:'36px', background:'#e8e8e8', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>
                        🛍
                      </div>
                      <div>
                        <p style={{ margin:'0', fontWeight:'500', color:'#1a1a2e', fontSize:'14px' }}>{item.product?.name || 'Product'}</p>
                        <p style={{ margin:'0', color:'#aaa', fontSize:'12px' }}>Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p style={{ margin:'0', fontWeight:'600', color:'#1a1a2e', fontSize:'14px' }}>₹{item.price * item.qty}</p>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'#aaa', fontSize:'13px' }}>
                  <span>📅</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ margin:'0', fontSize:'13px', color:'#aaa' }}>Order Total</p>
                  <p style={{ margin:'0', fontSize:'20px', fontWeight:'700', color:'#e94560' }}>₹{order.total}</p>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;