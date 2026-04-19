import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const items = useCartStore(s => s.items);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 24px', background:'#1a1a2e', color:'white' }}>
      <Link to="/" style={{ color:'white', textDecoration:'none', fontSize:'20px', fontWeight:'bold' }}>ShopApp</Link>
      <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
        <Link to="/" style={{ color:'white', textDecoration:'none' }}>Home</Link>
        {user && <Link to="/orders" style={{ color:'white', textDecoration:'none' }}>My Orders</Link>}
        {user?.role === 'admin' && <Link to="/admin" style={{ color:'white', textDecoration:'none' }}>Admin</Link>}
        {user && (
          <Link to="/cart" style={{ color:'white', textDecoration:'none' }}>
            Cart ({items.length})
          </Link>
        )}
        {user ? (
  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
    <Link to="/profile" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
      <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'#e94560', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'700', color:'white' }}>
        {user.name?.charAt(0).toUpperCase()}
      </div>
      <span style={{ color:'#ccc', fontSize:'14px' }}>{user.name}</span>
    </Link>
    <button onClick={handleLogout} style={{ background:'transparent', border:'1px solid #e94560', color:'#e94560', padding:'8px 16px', borderRadius:'20px', cursor:'pointer', fontSize:'14px', fontWeight:'500' }}>
      Logout
    </button>
  </div>
) : (
  <Link to="/login" style={{ background:'#e94560', color:'white', padding:'8px 16px', borderRadius:'20px', textDecoration:'none', fontSize:'14px', fontWeight:'500' }}>Login</Link>
)}
      </div>
    </nav>
  );
};

export default Navbar;