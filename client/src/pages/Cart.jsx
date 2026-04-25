import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = Math.round(total * 0.1);

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(233,69,96,0.08)', border: '2px dashed rgba(233,69,96,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 40,
          }}>🛒</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>Your cart is empty</h2>
          <p style={{ color: '#9ca3af', marginBottom: 32 }}>Looks like you haven't added anything yet.</p>
          <Link to="/" style={{
            display: 'inline-block', padding: '14px 32px',
            background: 'linear-gradient(135deg, #e94560, #c73652)',
            color: 'white', textDecoration: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 600,
            boxShadow: '0 6px 20px rgba(233,69,96,0.3)',
          }}>Start Shopping →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f7f4' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
            Shopping Cart
          </h1>
          <p style={{ color: '#9ca3af' }}>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>

          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((item, i) => (
              <div key={item._id} style={{
                background: 'white', borderRadius: 20,
                border: '1px solid #e5e7eb', padding: 20,
                display: 'flex', gap: 20, alignItems: 'center',
                animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
              }}>
                {/* Image */}
                <div style={{
                  width: 90, height: 90, borderRadius: 12,
                  background: '#f8f7f4', overflow: 'hidden', flexShrink: 0,
                  border: '1px solid #e5e7eb',
                }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'inline-block', background: 'rgba(233,69,96,0.08)',
                    color: '#e94560', fontSize: 11, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 100, marginBottom: 6,
                  }}>{item.category}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>{item.name}</h3>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#e94560', fontFamily: "'Playfair Display', serif" }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  {item.quantity > 1 && (
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>₹{item.price.toLocaleString()} each</p>
                  )}
                </div>

                {/* Quantity + Remove */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 0,
                    border: '1.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden',
                  }}>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      style={{
                        width: 36, height: 36, border: 'none', background: '#f8f7f4',
                        cursor: 'pointer', fontSize: 18, color: '#374151',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>−</button>
                    <span style={{
                      width: 40, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#1a1a2e',
                    }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      style={{
                        width: 36, height: 36, border: 'none', background: '#f8f7f4',
                        cursor: 'pointer', fontSize: 18, color: '#374151',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item._id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#ef4444', fontSize: 13, fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                    padding: '4px 8px', borderRadius: 6,
                  }}>Remove</button>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button onClick={clearCart} style={{
              background: 'none', border: '1.5px dashed #e5e7eb',
              color: '#9ca3af', cursor: 'pointer', padding: '12px',
              borderRadius: 12, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#ef4444'; e.target.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.color = '#9ca3af'; }}
            >Clear Cart</button>
          </div>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', padding: 28, position: 'sticky', top: 90 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {[
                ['Subtotal', `₹${total.toLocaleString()}`],
                ['You save (10%)', `-₹${savings.toLocaleString()}`, '#10b981'],
                ['Shipping', 'Free', '#10b981'],
              ].map(([label, value, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>{label}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: color || '#1a1a2e' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: '#e5e7eb', margin: '20px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#e94560', fontFamily: "'Playfair Display', serif" }}>
                ₹{(total - savings).toLocaleString()}
              </span>
            </div>

            <button onClick={() => navigate('/checkout')} style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg, #e94560, #c73652)',
              color: 'white', border: 'none', borderRadius: 12,
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 6px 20px rgba(233,69,96,0.3)',
              transition: 'all 0.2s', marginBottom: 12,
            }}>Proceed to Checkout →</button>

            <Link to="/" style={{
              display: 'block', textAlign: 'center', padding: '12px',
              color: '#6b7280', textDecoration: 'none', fontSize: 14,
              borderRadius: 12, border: '1px solid #e5e7eb',
              transition: 'all 0.2s',
            }}>← Continue Shopping</Link>

            {/* Trust Badges */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
              {['🔒 Secure checkout', '🚚 Free shipping', '↩️ Easy returns'].map(badge => (
                <div key={badge} style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>{badge}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
