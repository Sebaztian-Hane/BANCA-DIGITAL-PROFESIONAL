import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';
import Navbar from './components/common/Navbar.jsx';

// Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/client/Dashboard.jsx';
import Transactions from './pages/client/Transactions.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UsersList from './pages/admin/UsersList.jsx';
import UserDetails from './pages/admin/UserDetails.jsx';

// Styles
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/transactions" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Transactions />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <AdminRoute>
              <>
                <Navbar />
                <AdminDashboard />
              </>
            </AdminRoute>
          } />
          
          <Route path="/admin/users" element={
            <AdminRoute>
              <>
                <Navbar />
                <UsersList />
              </>
            </AdminRoute>
          } />
          
          <Route path="/admin/users/:userId" element={
            <AdminRoute>
              <>
                <Navbar />
                <UserDetails />
              </>
            </AdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;