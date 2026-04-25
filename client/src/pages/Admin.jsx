import { useEffect, useState } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const Admin = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', image: '', stock: '' });

  const CATEGORIES = ['Electronics', 'Footwear', 'Kitchen', 'Bags', 'Accessories'];
  const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [p, o] = await Promise.all([axios.get('/products'), axios.get('/orders')]);
      setProducts(p.data);
      setOrders(o.data);
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await axios.put(`/products/${editProduct._id}`, form);
        toast.success('Product updated!', { style: { borderRadius: '12px', background: '#1a1a2e', color: '#fff' } });
      } else {
        await axios.post('/products', form);
        toast.success('Product added!', { style: { borderRadius: '12px', background: '#1a1a2e', color: '#fff' } });
      }
      setShowForm(false);
      setEditProduct(null);
      setForm({ name: '', price: '', description: '', category: '', image: '', stock: '' });
      fetchAll();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated!');
      fetchAll();
    } catch { toast.error('Update failed'); }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name, price: product.price,
      description: product.description, category: product.category,
      image: product.image, stock: product.stock,
    });
    setShowForm(true);
  };

  const STATUS_COLORS = {
    pending: '#d97706', processing: '#2563eb', shipped: '#7c3aed',
    delivered: '#059669', cancelled: '#dc2626',
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: '📦', color: '#e94560' },
    { label: 'Total Orders', value: orders.length, icon: '🛒', color: '#2563eb' },
    { label: 'Revenue', value: `₹${orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}`, icon: '💰', color: '#059669' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: '✅', color: '#7c3aed' },
  ];

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f7f4' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Admin Dashboard</h1>
            <p style={{ color: '#9ca3af' }}>Manage your store products and orders</p>
          </div>
          {tab === 'products' && (
            <button onClick={() => { setShowForm(true); setEditProduct(null); setForm({ name: '', price: '', description: '', category: '', image: '', stock: '' }); }}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #e94560, #c73652)',
                color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 4px 16px rgba(233,69,96,0.3)',
              }}>+ Add Product</button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {stats.map(({ label, value, icon, color }) => (
            <div key={label} style={{
              background: 'white', borderRadius: 18, border: '1px solid #e5e7eb',
              padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, fontSize: 24,
                background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Playfair Display', serif" }}>{value}</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['products', 'orders'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 24px', borderRadius: 10, cursor: 'pointer',
              border: '1.5px solid', fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
              background: tab === t ? '#1a1a2e' : 'white',
              color: tab === t ? 'white' : '#6b7280',
              borderColor: tab === t ? '#1a1a2e' : '#e5e7eb',
            }}>{t === 'products' ? '📦 Products' : '🛒 Orders'}</button>
          ))}
        </div>

        {/* Products Table */}
        {tab === 'products' && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f7f4', borderBottom: '1px solid #e5e7eb' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={p.image} alt={p.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: '#9ca3af', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: 'rgba(233,69,96,0.08)', color: '#e94560', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 15, fontWeight: 700, color: '#e94560', fontFamily: "'Playfair Display', serif" }}>₹{p.price?.toLocaleString()}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                        background: p.stock > 10 ? 'rgba(16,185,129,0.1)' : p.stock > 0 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: p.stock > 10 ? '#059669' : p.stock > 0 ? '#d97706' : '#dc2626',
                      }}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{
                          padding: '7px 16px', background: '#f8f7f4', border: '1px solid #e5e7eb',
                          borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                          color: '#374151', fontFamily: "'DM Sans', sans-serif",
                        }}>Edit</button>
                        <button onClick={() => handleDelete(p._id)} style={{
                          padding: '7px 16px', background: '#fef2f2', border: '1px solid #fecaca',
                          borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                          color: '#dc2626', fontFamily: "'DM Sans', sans-serif",
                        }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Table */}
        {tab === 'orders' && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f7f4', borderBottom: '1px solid #e5e7eb' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 600, color: '#6b7280', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#1a1a2e' }}>{order.user?.name || 'Guest'}</td>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{order.items?.length} items</td>
                    <td style={{ padding: '16px 20px', fontSize: 15, fontWeight: 700, color: '#e94560', fontFamily: "'Playfair Display', serif" }}>₹{order.total?.toLocaleString()}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <select
                        value={order.status}
                        onChange={e => handleStatusUpdate(order._id, e.target.value)}
                        style={{
                          padding: '6px 12px', borderRadius: 8,
                          border: '1.5px solid #e5e7eb', fontSize: 13, fontWeight: 600,
                          color: STATUS_COLORS[order.status] || '#374151',
                          background: 'white', cursor: 'pointer',
                          fontFamily: "'DM Sans', sans-serif", outline: 'none',
                        }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 13, color: '#9ca3af' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showForm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 24, backdropFilter: 'blur(4px)',
          }} onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <div style={{
              background: 'white', borderRadius: 24, padding: 36,
              width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
              </div>

              <form onSubmit={handleProductSubmit}>
                {[
                  { key: 'name', label: 'Product Name', type: 'text', placeholder: 'Wireless Headphones' },
                  { key: 'price', label: 'Price (₹)', type: 'number', placeholder: '1999' },
                  { key: 'stock', label: 'Stock', type: 'number', placeholder: '50' },
                  { key: 'image', label: 'Image URL', type: 'url', placeholder: 'https://...' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key} style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                    <input
                      type={type} required placeholder={placeholder}
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

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required
                    style={{
                      width: '100%', padding: '12px 16px',
                      border: '1.5px solid #e5e7eb', borderRadius: 12,
                      fontSize: 15, outline: 'none', fontFamily: "'DM Sans', sans-serif",
                      color: '#1a1a2e', background: 'white',
                    }}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>Description</label>
                  <textarea required placeholder="Product description..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%', padding: '12px 16px',
                      border: '1.5px solid #e5e7eb', borderRadius: 12,
                      fontSize: 15, outline: 'none', fontFamily: "'DM Sans', sans-serif",
                      color: '#1a1a2e', resize: 'vertical',
                    }}
                    onFocus={e => e.target.style.borderColor = '#e94560'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{
                    flex: 1, padding: '13px', background: 'white',
                    border: '1.5px solid #e5e7eb', borderRadius: 12, cursor: 'pointer',
                    fontSize: 15, fontWeight: 600, color: '#6b7280', fontFamily: "'DM Sans', sans-serif",
                  }}>Cancel</button>
                  <button type="submit" style={{
                    flex: 2, padding: '13px',
                    background: 'linear-gradient(135deg, #e94560, #c73652)',
                    color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer',
                    fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                    boxShadow: '0 4px 16px rgba(233,69,96,0.3)',
                  }}>{editProduct ? 'Save Changes' : 'Add Product'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
