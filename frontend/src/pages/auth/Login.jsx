import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🏦 Banco Digital</h1>
          <p>Inicia sesión en tu cuenta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn-auth" disabled={loading}>
            <FiLogIn />
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;