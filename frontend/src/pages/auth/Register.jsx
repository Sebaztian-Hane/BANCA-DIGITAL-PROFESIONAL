import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiPhone, FiFileText } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dni: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error del campo
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
    if (!formData.email.trim()) newErrors.email = 'Email requerido';
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (!formData.dni.trim()) newErrors.dni = 'DNI requerido';
    if (!formData.dni.match(/^\d{8}$/)) newErrors.dni = 'DNI debe tener 8 dígitos';
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Crear Cuenta</h1>
          <p>Regístrate para comenzar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <FiFileText className="input-icon" />
              <input
                type="text"
                name="dni"
                placeholder="DNI"
                value={formData.dni}
                onChange={handleChange}
              />
              {errors.dni && <span className="error-text">{errors.dni}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <FiPhone className="input-icon" />
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="address"
              placeholder="Dirección (opcional)"
              value={formData.address}
              onChange={handleChange}
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
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;