import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiLogOut, FiUser, FiHome, FiList, FiBarChart2 } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🏦 Banco Digital
        </Link>
        
        <div className="navbar-menu">
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">
                <FiHome /> Inicio
              </Link>
              <Link to="/transactions" className="nav-link">
                <FiList /> Transacciones
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  <FiBarChart2 /> Admin
                </Link>
              )}
            </>
          )}
        </div>
        
        <div className="navbar-user">
          {user && (
            <>
              <span className="user-name">
                <FiUser /> {user.name}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                <FiLogOut /> Salir
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;