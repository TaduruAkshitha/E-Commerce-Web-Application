import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Electronics', 'Footwear', 'Kitchen', 'Bags', 'Accessories'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/products').then(r => {
      setProducts(r.data);
      setFiltered(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'All') result = result.filter(p => p.category === category);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [category, search, products]);

  const handleAddToCart = (product) => {
    if (!user) return navigate('/login');
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: '12px', background: '#1a1a2e', color: '#fff' },
      iconTheme: { primary: '#e94560', secondary: '#fff' }
    });
  };

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#f8f7f4' }}>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(233,69,96,0.08)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -40, width: 250, height: 250,
          borderRadius: '50%', background: 'rgba(233,69,96,0.05)', pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.3)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 24
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e94560', display: 'inline-block' }} />
            <span style={{ color: '#e94560', fontSize: 13, fontWeight: 600 }}>New Collection Available</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700, color: 'white',
            lineHeight: 1.15, marginBottom: 20,
            letterSpacing: '-1px',
          }}>
            Discover Products<br />
            <span style={{ color: '#e94560' }}>You'll Love</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, maxWidth: 500, margin: '0 auto 40px' }}>
            Curated collections at amazing prices, delivered to your door.
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: 560, margin: '0 auto',
            display: 'flex', gap: 12,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 16, padding: 8,
          }}>
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'white', fontSize: 15, padding: '8px 12px',
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <button style={{
              background: '#e94560', color: 'white', border: 'none',
              borderRadius: 10, padding: '10px 24px', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            }}>Search</button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 48,
            marginTop: 56, paddingTop: 40,
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            {[['500+', 'Products'], ['10K+', 'Customers'], ['4.9★', 'Rating']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'white', fontFamily: "'Playfair Display', serif" }}>{num}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Category Filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1a1a2e' }}>
            {category === 'All' ? 'All Products' : category}
            <span style={{ fontSize: 16, fontWeight: 400, color: '#9ca3af', marginLeft: 12 }}>({filtered.length})</span>
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '8px 18px', borderRadius: 100, cursor: 'pointer',
                border: '1.5px solid', fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                background: category === cat ? '#1a1a2e' : 'white',
                color: category === cat ? 'white' : '#6b7280',
                borderColor: category === cat ? '#1a1a2e' : '#e5e7eb',
                boxShadow: category === cat ? '0 4px 12px rgba(26,26,46,0.2)' : 'none',
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ height: 220, background: '#f0f0f0', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ height: 16, background: '#f0f0f0', borderRadius: 8, marginBottom: 12 }} />
                  <div style={{ height: 12, background: '#f0f0f0', borderRadius: 8, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>No products found</h3>
            <p style={{ color: '#9ca3af' }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {filtered.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} onAddToCart={handleAddToCart} user={user} navigate={navigate} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const ProductCard = ({ product, index, onAddToCart, user, navigate }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white', borderRadius: 20,
        border: '1px solid', borderColor: hovered ? '#e94560' : '#e5e7eb',
        overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 50px rgba(233,69,96,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
        animation: `fadeUp 0.4s ease ${index * 0.06}s both`,
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 220, background: '#f8f7f4' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />
        {/* Category Badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(26,26,46,0.85)', color: 'white',
          padding: '4px 12px', borderRadius: 100,
          fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
          backdropFilter: 'blur(8px)',
        }}>{product.category}</div>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(245,158,11,0.9)', color: 'white',
            padding: '4px 10px', borderRadius: 100,
            fontSize: 11, fontWeight: 600,
          }}>Only {product.stock} left!</div>
        )}
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 24px' }}>
        <h3 style={{
          fontSize: 16, fontWeight: 600, color: '#1a1a2e',
          marginBottom: 6, lineHeight: 1.3,
          fontFamily: "'Playfair Display', serif",
        }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16, lineHeight: 1.5 }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              fontSize: 22, fontWeight: 700, color: '#e94560',
              fontFamily: "'Playfair Display', serif",
            }}>₹{product.price.toLocaleString()}</span>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
              {product.stock} in stock
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            style={{
              background: product.stock === 0 ? '#f3f4f6' : hovered ? '#e94560' : '#1a1a2e',
              color: product.stock === 0 ? '#9ca3af' : 'white',
              border: 'none', borderRadius: 12,
              padding: '10px 20px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
              boxShadow: product.stock > 0 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            }}
          >
            {!user ? 'Login to Buy' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
