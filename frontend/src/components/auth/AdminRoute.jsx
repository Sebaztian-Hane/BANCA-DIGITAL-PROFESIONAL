import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  return isAuthenticated && isAdmin ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;