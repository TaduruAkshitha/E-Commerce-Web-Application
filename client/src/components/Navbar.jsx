import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const items = useCartStore(s => s.items);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #e94560, #c73652)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(233,69,96,0.3)'
          }}>
            <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>S</span>
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.3px'
          }}>ShopApp</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[{ to: '/', label: 'Home' }].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
              color: location.pathname === to ? '#e94560' : '#6b7280',
              background: location.pathname === to ? 'rgba(233,69,96,0.08)' : 'transparent',
            }}>{label}</Link>
          ))}
          {user && (
            <>
              <Link to="/orders" style={{
                padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
                fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
                color: location.pathname === '/orders' ? '#e94560' : '#6b7280',
                background: location.pathname === '/orders' ? 'rgba(233,69,96,0.08)' : 'transparent',
              }}>My Orders</Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{
                  padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
                  fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
                  color: location.pathname === '/admin' ? '#e94560' : '#6b7280',
                  background: location.pathname === '/admin' ? 'rgba(233,69,96,0.08)' : 'transparent',
                }}>Admin</Link>
              )}
            </>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              {/* Cart */}
              <Link to="/cart" style={{
                position: 'relative', textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 42, height: 42, borderRadius: 12,
                background: items.length > 0 ? 'rgba(233,69,96,0.08)' : '#f8f7f4',
                border: '1px solid', borderColor: items.length > 0 ? 'rgba(233,69,96,0.2)' : '#e5e7eb',
                transition: 'all 0.2s',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={items.length > 0 ? '#e94560' : '#6b7280'} strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {items.length > 0 && (
                  <span style={{
                    position: 'absolute', top: -6, right: -6,
                    background: '#e94560', color: 'white',
                    fontSize: 11, fontWeight: 700, width: 20, height: 20,
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid white',
                  }}>{items.length}</span>
                )}
              </Link>

              {/* Profile */}
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px 6px 6px',
                background: '#f8f7f4', borderRadius: 100,
                border: '1px solid #e5e7eb', textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e94560, #c73652)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white',
                }}>{user.name?.charAt(0).toUpperCase()}</div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                  {user.name?.split(' ')[0]}
                </span>
              </Link>

              {/* Logout */}
              <button onClick={handleLogout} style={{
                background: 'transparent', border: '1px solid #e5e7eb',
                padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
                fontSize: 13, fontWeight: 500, color: '#6b7280',
                transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#e94560'; e.target.style.color = '#e94560'; }}
              onMouseLeave={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.color = '#6b7280'; }}
              >Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '9px 20px', borderRadius: 10, textDecoration: 'none',
                fontSize: 14, fontWeight: 500, color: '#6b7280',
                border: '1px solid #e5e7eb', transition: 'all 0.2s',
              }}>Login</Link>
              <Link to="/register" style={{
                padding: '9px 20px', borderRadius: 10, textDecoration: 'none',
                fontSize: 14, fontWeight: 600, color: 'white',
                background: 'linear-gradient(135deg, #e94560, #c73652)',
                boxShadow: '0 4px 12px rgba(233,69,96,0.25)',
                transition: 'all 0.2s',
              }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
