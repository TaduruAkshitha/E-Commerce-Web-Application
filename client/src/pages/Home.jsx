import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import Navbar from '../components/Navbar';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { addItem, removeItem, items } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  const isInCart = (id) => items.some(i => i._id === id);
  const getQty = (id) => items.find(i => i._id === id)?.qty || 0;

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
      <Navbar />
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <h1 style={{ fontSize:'36px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 8px' }}>Discover Our Products</h1>
          <p style={{ color:'#666', fontSize:'16px' }}>Find the best products at amazing prices</p>
        </div>

        <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex:1, minWidth:'200px', padding:'12px 16px', borderRadius:'10px', border:'1px solid #ddd', fontSize:'15px', outline:'none', background:'white' }}
          />
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ padding:'10px 18px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:'500', fontSize:'14px',
                  background: category === cat ? '#1a1a2e' : 'white',
                  color: category === cat ? 'white' : '#555',
                  border: category === cat ? 'none' : '1px solid #ddd'
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px', color:'#888' }}>
            <p style={{ fontSize:'18px' }}>No products found.</p>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'24px' }}>
          {filtered.map(product => (
            <div key={product._id} style={{ background:'white', borderRadius:'16px', overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', transition:'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.08)'; }}>
              <div style={{ height:'200px', overflow:'hidden', position:'relative' }}>
                {product.images?.[0]
                  ? <img src={product.images[0]} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:'100%', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa' }}>No Image</div>
                }
                <span style={{ position:'absolute', top:'12px', left:'12px', background:'#1a1a2e', color:'white', padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500' }}>
                  {product.category}
                </span>
              </div>
              <div style={{ padding:'16px' }}>
                <h3 style={{ margin:'0 0 6px', fontSize:'17px', fontWeight:'600', color:'#1a1a2e' }}>{product.name}</h3>
                <p style={{ margin:'0 0 12px', color:'#888', fontSize:'13px', lineHeight:'1.4' }}>{product.description}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                  <span style={{ fontSize:'22px', fontWeight:'700', color:'#e94560' }}>₹{product.price}</span>
                  <span style={{ fontSize:'12px', color: product.stock > 0 ? '#2ecc71' : '#e74c3c', fontWeight:'500' }}>
                    {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                  </span>
                </div>
                {user && (
                  isInCart(product._id) ? (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f8f9fa', borderRadius:'10px', padding:'6px' }}>
                      <button onClick={() => removeItem(product._id)}
                        style={{ width:'36px', height:'36px', border:'none', borderRadius:'8px', background:'#e94560', color:'white', fontSize:'20px', cursor:'pointer', fontWeight:'bold' }}>
                        −
                      </button>
                      <span style={{ fontWeight:'600', fontSize:'16px' }}>{getQty(product._id)}</span>
                      <button onClick={() => { addItem(product); toast.success('Added to cart!'); }}
                        style={{ width:'36px', height:'36px', border:'none', borderRadius:'8px', background:'#1a1a2e', color:'white', fontSize:'20px', cursor:'pointer', fontWeight:'bold' }}>
                        +
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { addItem(product); toast.success('Added to cart!'); }} disabled={product.stock === 0}
                      style={{ width:'100%', padding:'10px', background: product.stock === 0 ? '#ccc' : '#1a1a2e', color:'white', border:'none', borderRadius:'10px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontSize:'15px', fontWeight:'500', transition:'background 0.2s' }}
                      onMouseEnter={e => { if(product.stock > 0) e.target.style.background='#e94560'; }}
                      onMouseLeave={e => { if(product.stock > 0) e.target.style.background='#1a1a2e'; }}>
                      Add to Cart
                    </button>
                  )
                )}
                {!user && (
                  <button onClick={() => window.location.href='/login'}
                    style={{ width:'100%', padding:'10px', background:'#1a1a2e', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'15px', fontWeight:'500' }}>
                    Login to Buy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;