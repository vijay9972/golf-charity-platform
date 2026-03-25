import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Trophy, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAdmin = user?.email === 'admin@fairwayfund.com';

  return (
    <nav className="glass-panel" style={{ borderRadius: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)' }}>
        <Trophy color="var(--accent-primary)" size={28} />
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>FairwayFund</h2>
      </Link>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/charities" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>Charities</Link>
        {user ? (
          <>
            <Link to={isAdmin ? "/admin" : "/dashboard"} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ padding: '10px 24px', textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
