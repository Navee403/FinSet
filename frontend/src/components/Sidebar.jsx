import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  History as HistoryIcon,
  Target,
  Users,
  Settings as SettingsIcon,
  LogOut,
  User
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="logo-area">
        <div className="logo-icon">F</div>
        FinSet
      </div>

      <nav className="nav-menu">
        <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link to="/log-transaction" className={`nav-item ${location.pathname === '/log-transaction' ? 'active' : ''}`}>
          <ArrowRightLeft size={18} />
          Transactions
        </Link>
        <Link to="/history" className={`nav-item ${location.pathname === '/history' ? 'active' : ''}`}>
          <HistoryIcon size={18} />
          History
        </Link>
        <Link to="/budgets" className={`nav-item ${location.pathname === '/budgets' ? 'active' : ''}`}>
          <Target size={18} />
          Budgets
        </Link>
        <Link to="/debts" className={`nav-item ${location.pathname === '/debts' ? 'active' : ''}`}>
          <Users size={18} />
          Debts
        </Link>

      </nav>

      <div className="bottom-nav">
        <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <User size={18} />
          Profile
        </Link>
        <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <SettingsIcon size={18} />
          Settings
        </Link>
        <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
