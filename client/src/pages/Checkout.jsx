import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    street: '', city: '', state: '', pincode: '', phone: '',
    payment: 'cod',
  });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const savings = Math.round(total * 0.1);
  const finalTotal = total - savings;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/orders', {
        items: items.map(i => ({ product: i._id, quantity: i.quantity, price: i.price })),
        total: finalTotal,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        paymentMethod: form.payment,
      });
      clearCart();
      toast.success('Order placed successfully! 🎉', {
        style: { borderRadius: '12px', background: '#1a1a2e', color: '#fff' }
      });
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f7f4' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Checkout</h1>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
            {['Delivery', 'Payment', 'Review'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step > i + 1 ? '#10b981' : step === i + 1 ? '#e94560' : '#e5e7eb',
                  color: step >= i + 1 ? 'white' : '#9ca3af',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, transition: 'all 0.3s',
                }}>{step > i + 1 ? '✓' : i + 1}</div>
                <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? '#1a1a2e' : '#9ca3af' }}>{s}</span>
                {i < 2 && <div style={{ width: 40, height: 1, background: step > i + 1 ? '#10b981' : '#e5e7eb', transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1 - Delivery */}
            <div style={{
              background: 'white', borderRadius: 20, border: '1px solid #e5e7eb',
              padding: 28, marginBottom: 20,
              opacity: step >= 1 ? 1 : 0.5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
                  📦 Delivery Address
                </h2>
                {step > 1 && (
                  <button type="button" onClick={() => setStep(1)} style={{
                    background: 'none', border: 'none', color: '#e94560', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  }}>Edit</button>
                )}
              </div>

              {step === 1 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                    {[
                      { key: 'street', label: 'Street Address', placeholder: '123 Main Street, Apartment 4B', full: true },
                      { key: 'city', label: 'City', placeholder: 'Hyderabad' },
                      { key: 'state', label: 'State', placeholder: 'Telangana' },
                      { key: 'pincode', label: 'Pincode', placeholder: '500001' },
                      { key: 'phone', label: 'Phone Number', placeholder: '+91 9876543210' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                        <input
                          type="text" required placeholder={placeholder}
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
                  </div>
                  <button type="button" onClick={() => setStep(2)} style={{
                    marginTop: 24, padding: '13px 32px',
                    background: 'linear-gradient(135deg, #e94560, #c73652)',
                    color: 'white', border: 'none', borderRadius: 12,
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: '0 4px 16px rgba(233,69,96,0.3)',
                  }}>Continue to Payment →</button>
                </>
              )}

              {step > 1 && (
                <div style={{ background: '#f8f7f4', borderRadius: 12, padding: '14px 16px' }}>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                    {form.street}, {form.city}, {form.state} - {form.pincode}<br />
                    <span style={{ color: '#9ca3af' }}>{form.phone}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Step 2 - Payment */}
            {step >= 2 && (
              <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', padding: 28, marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 }}>
                  💳 Payment Method
                </h2>
                {step === 2 && (
                  <>
                    {[
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                      { id: 'upi', label: 'UPI Payment', desc: 'PhonePe, GPay, Paytm', icon: '📱' },
                      { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                    ].map(({ id, label, desc, icon }) => (
                      <div key={id} onClick={() => setForm({ ...form, payment: id })} style={{
                        display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                        border: `2px solid ${form.payment === id ? '#e94560' : '#e5e7eb'}`,
                        borderRadius: 14, marginBottom: 12, cursor: 'pointer',
                        background: form.payment === id ? 'rgba(233,69,96,0.04)' : 'white',
                        transition: 'all 0.2s',
                      }}>
                        <span style={{ fontSize: 24 }}>{icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>{label}</div>
                          <div style={{ fontSize: 13, color: '#9ca3af' }}>{desc}</div>
                        </div>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `2px solid ${form.payment === id ? '#e94560' : '#d1d5db'}`,
                          background: form.payment === id ? '#e94560' : 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {form.payment === id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setStep(3)} style={{
                      marginTop: 12, padding: '13px 32px',
                      background: 'linear-gradient(135deg, #e94560, #c73652)',
                      color: 'white', border: 'none', borderRadius: 12,
                      fontSize: 15, fontWeight: 600, cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      boxShadow: '0 4px 16px rgba(233,69,96,0.3)',
                    }}>Review Order →</button>
                  </>
                )}
              </div>
            )}

            {/* Step 3 - Submit */}
            {step >= 3 && (
              <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', padding: 28 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
                  ✅ Review & Place Order
                </h2>
                <div style={{ background: '#f8f7f4', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, color: '#374151', marginBottom: 6 }}>
                    <strong>Delivering to:</strong> {form.street}, {form.city}, {form.state} - {form.pincode}
                  </p>
                  <p style={{ fontSize: 14, color: '#374151' }}>
                    <strong>Payment:</strong> {form.payment === 'cod' ? 'Cash on Delivery' : form.payment.toUpperCase()}
                  </p>
                </div>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '15px',
                  background: loading ? '#f3f4f6' : 'linear-gradient(135deg, #e94560, #c73652)',
                  color: loading ? '#9ca3af' : 'white',
                  border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 17, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(233,69,96,0.3)',
                  transition: 'all 0.2s',
                }}>
                  {loading ? 'Placing Order...' : `Place Order • ₹${finalTotal.toLocaleString()}`}
                </button>
              </div>
            )}
          </form>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', padding: 24, position: 'sticky', top: 90 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
              {items.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />
            {[['Subtotal', `₹${total.toLocaleString()}`], ['Discount', `-₹${savings.toLocaleString()}`, '#10b981'], ['Shipping', 'Free', '#10b981']].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: c || '#1a1a2e' }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#e94560', fontFamily: "'Playfair Display', serif" }}>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
