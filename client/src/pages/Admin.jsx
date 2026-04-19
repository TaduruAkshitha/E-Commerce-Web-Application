import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Admin = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', images: '' });

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  };

  const fetchOrders = async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      toast.error('Name, price and stock are required');
      return;
    }
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), images: form.images ? [form.images] : [] };
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product added!');
      }
      setShowForm(false);
      setEditProduct(null);
      setForm({ name: '', description: '', price: '', stock: '', category: '', images: '' });
      fetchProducts();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({ name: product.name, description: product.description || '', price: product.price, stock: product.stock, category: product.category || '', images: product.images?.[0] || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted!');
    fetchProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    toast.success('Order status updated!');
    fetchOrders();
  };

  const statusColor = { pending:'#f39c12', processing:'#3498db', shipped:'#9b59b6', delivered:'#2ecc71', cancelled:'#e74c3c' };

  const inputStyle = { width:'100%', padding:'11px 14px', borderRadius:'8px', border:'2px solid #e8e0ff', fontSize:'14px', marginBottom:'12px', boxSizing:'border-box', outline:'none', color:'#1a1a2e', background:'#faf8ff' };

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
      <Navbar />
      <div style={{ maxWidth:'1100px', margin:'32px auto', padding:'0 24px' }}>
        <h1 style={{ fontSize:'28px', fontWeight:'700', color:'#1a1a2e', marginBottom:'24px' }}>Admin Dashboard</h1>

        <div style={{ display:'flex', gap:'12px', marginBottom:'28px' }}>
          <button onClick={() => setTab('products')}
            style={{ padding:'10px 24px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:'600', fontSize:'14px', background: tab === 'products' ? '#1a1a2e' : 'white', color: tab === 'products' ? 'white' : '#555', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            Products
          </button>
          <button onClick={() => setTab('orders')}
            style={{ padding:'10px 24px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:'600', fontSize:'14px', background: tab === 'orders' ? '#1a1a2e' : 'white', color: tab === 'orders' ? 'white' : '#555', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            Orders ({orders.length})
          </button>
        </div>

        {tab === 'products' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'20px', fontWeight:'600', color:'#1a1a2e', margin:'0' }}>All Products ({products.length})</h2>
              <button onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ name:'', description:'', price:'', stock:'', category:'', images:'' }); }}
                style={{ padding:'10px 20px', background:'#e94560', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>
                + Add Product
              </button>
            </div>

            {showForm && (
              <div style={{ background:'white', borderRadius:'16px', padding:'24px', marginBottom:'24px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin:'0 0 20px', color:'#1a1a2e' }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <input placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
                  <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle} />
                  <input placeholder="Price (₹)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inputStyle} />
                  <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={inputStyle} />
                </div>
                <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={inputStyle} />
                <input placeholder="Image URL (optional)" value={form.images} onChange={e => setForm({...form, images: e.target.value})} style={{...inputStyle, marginBottom:'16px'}} />
                <div style={{ display:'flex', gap:'12px' }}>
                  <button onClick={handleSubmit}
                    style={{ padding:'10px 24px', background:'#1a1a2e', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' }}>
                    {editProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button onClick={() => { setShowForm(false); setEditProduct(null); }}
                    style={{ padding:'10px 24px', background:'#f0f0f0', color:'#555', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div style={{ background:'white', borderRadius:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#f8f9fa' }}>
                    <th style={{ padding:'14px 16px', textAlign:'left', fontSize:'13px', fontWeight:'600', color:'#888' }}>PRODUCT</th>
                    <th style={{ padding:'14px 16px', textAlign:'left', fontSize:'13px', fontWeight:'600', color:'#888' }}>CATEGORY</th>
                    <th style={{ padding:'14px 16px', textAlign:'left', fontSize:'13px', fontWeight:'600', color:'#888' }}>PRICE</th>
                    <th style={{ padding:'14px 16px', textAlign:'left', fontSize:'13px', fontWeight:'600', color:'#888' }}>STOCK</th>
                    <th style={{ padding:'14px 16px', textAlign:'left', fontSize:'13px', fontWeight:'600', color:'#888' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ borderTop:'1px solid #f0f0f0' }}>
                      <td style={{ padding:'14px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width:'44px', height:'44px', borderRadius:'8px', objectFit:'cover' }} />}
                          <span style={{ fontWeight:'500', color:'#1a1a2e', fontSize:'14px' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:'14px 16px', color:'#888', fontSize:'14px' }}>{p.category}</td>
                      <td style={{ padding:'14px 16px', fontWeight:'600', color:'#e94560' }}>₹{p.price}</td>
                      <td style={{ padding:'14px 16px', color: p.stock > 0 ? '#2ecc71' : '#e74c3c', fontWeight:'500' }}>{p.stock}</td>
                      <td style={{ padding:'14px 16px' }}>
                        <div style={{ display:'flex', gap:'8px' }}>
                          <button onClick={() => handleEdit(p)}
                            style={{ padding:'6px 14px', background:'#f0f0f0', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontWeight:'500' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(p._id)}
                            style={{ padding:'6px 14px', background:'#ffe5e5', color:'#e74c3c', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontWeight:'500' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h2 style={{ fontSize:'20px', fontWeight:'600', color:'#1a1a2e', marginBottom:'20px' }}>All Orders</h2>
            {orders.map(order => (
              <div key={order._id} style={{ background:'white', borderRadius:'16px', padding:'20px', marginBottom:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                  <div>
                    <p style={{ margin:'0', fontWeight:'600', color:'#1a1a2e' }}>{order.user?.name}</p>
                    <p style={{ margin:'4px 0 0', color:'#888', fontSize:'13px' }}>{order.user?.email}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}
                      style={{ padding:'8px 12px', borderRadius:'8px', border:`2px solid ${statusColor[order.status]}`, color: statusColor[order.status], fontWeight:'600', fontSize:'13px', outline:'none', cursor:'pointer', background:'white' }}>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span style={{ fontWeight:'700', color:'#e94560', fontSize:'16px' }}>₹{order.total}</span>
                  </div>
                </div>
                <div style={{ background:'#f8f9fa', borderRadius:'8px', padding:'12px' }}>
                  {order.items?.map((item, i) => (
                    <p key={i} style={{ margin:'4px 0', fontSize:'13px', color:'#555' }}>
                      {item.product?.name} × {item.qty} — ₹{item.price * item.qty}
                    </p>
                  ))}
                </div>
                <p style={{ margin:'8px 0 0', fontSize:'12px', color:'#aaa' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;