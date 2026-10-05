import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
          <Activity size={24} color="#22C55E" />
          SPORTS <span>SCHEDULER</span>
        </Link>

        <ul className="navbar-nav">
          {user ? (
            <>
              <li>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/sessions" className={`nav-link ${isActive('/sessions') ? 'active' : ''}`}>
                  Available Sessions
                </Link>
              </li>
              <li>
                <Link to="/sessions/create" className={`nav-link ${isActive('/sessions/create') ? 'active' : ''}`}>
                  Create Session
                </Link>
              </li>
              <li>
                <Link to="/sessions/my" className={`nav-link ${isActive('/sessions/my') ? 'active' : ''}`}>
                  My Sessions
                </Link>
              </li>

              {isAdmin && (
                <>
                  <li>
                    <Link to="/admin/sports" className={`nav-link ${isActive('/admin/sports') ? 'active' : ''}`}>
                      Manage Sports
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/reports" className={`nav-link ${isActive('/admin/reports') ? 'active' : ''}`}>
                      Reports
                    </Link>
                  </li>
                </>
              )}

              <li className="user-pill">
                <Link to="/profile" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }} title="Edit Profile & Password">
                  <User size={14} />
                  <span style={{ fontWeight: 600 }}>{user.name}</span>
                </Link>
                <span className={`role-badge ${isAdmin ? 'admin' : 'player'}`}>{user.role}</span>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '0.25rem',
                  }}
                >
                  <LogOut size={16} />
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                  Get Started
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
