import { useEffect, useState } from 'react';
import axios from '../api/axios';

const STATUS_STYLES = {
  pending:    { bg: 'rgba(245,158,11,0.1)',  color: '#d97706', label: 'Pending' },
  processing: { bg: 'rgba(59,130,246,0.1)',  color: '#2563eb', label: 'Processing' },
  shipped:    { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed', label: 'Shipped' },
  delivered:  { bg: 'rgba(16,185,129,0.1)',  color: '#059669', label: 'Delivered' },
  cancelled:  { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626', label: 'Cancelled' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get('/orders/my').then(r => {
      setOrders(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: '#e94560', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#9ca3af' }}>Loading your orders...</p>
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>📦</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>No orders yet</h2>
        <p style={{ color: '#9ca3af', marginBottom: 28 }}>Your orders will appear here once you place them.</p>
        <a href="/" style={{
          display: 'inline-block', padding: '14px 32px',
          background: 'linear-gradient(135deg, #e94560, #c73652)',
          color: 'white', textDecoration: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 600,
          boxShadow: '0 6px 20px rgba(233,69,96,0.3)',
        }}>Start Shopping →</a>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f7f4' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>My Orders</h1>
          <p style={{ color: '#9ca3af' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order, i) => {
            const status = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
            const isOpen = expanded === order._id;
            return (
              <div key={order._id} style={{
                background: 'white', borderRadius: 20,
                border: `1px solid ${isOpen ? '#e94560' : '#e5e7eb'}`,
                overflow: 'hidden', transition: 'all 0.3s',
                animation: `fadeUp 0.4s ease ${i * 0.06}s both`,
              }}>
                {/* Order Header */}
                <div
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                  style={{
                    padding: '20px 24px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'rgba(233,69,96,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>📦</div>
                    <div>
                      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 3 }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} •{' '}
                        <span style={{ color: '#e94560', fontFamily: "'Playfair Display', serif" }}>₹{order.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-block', padding: '5px 14px', borderRadius: 100,
                        background: status.bg, color: status.color,
                        fontSize: 12, fontWeight: 700, marginBottom: 4,
                      }}>{status.label}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 20, color: '#9ca3af',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s',
                    }}>⌄</div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isOpen && (
                  <div style={{ padding: '0 24px 24px', borderTop: '1px solid #f3f4f6' }}>
                    <div style={{ paddingTop: 20 }}>
                      {/* Items */}
                      <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>Items Ordered</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {order.items?.map((item, j) => (
                            <div key={j} style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              padding: '12px 16px', background: '#f8f7f4', borderRadius: 12,
                            }}>
                              {item.product?.image && (
                                <img src={item.product.image} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                              )}
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{item.product?.name || 'Product'}</p>
                                <p style={{ fontSize: 12, color: '#9ca3af' }}>Qty: {item.quantity}</p>
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 600, color: '#e94560' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery */}
                      {order.address && (
                        <div style={{ background: '#f8f7f4', borderRadius: 12, padding: '14px 16px' }}>
                          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Delivery Address</h4>
                          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
                            {order.address.street}, {order.address.city}, {order.address.state} — {order.address.pincode}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
