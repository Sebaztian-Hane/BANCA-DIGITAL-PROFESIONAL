import React, { useState } from 'react';
import { FiSend, FiDownload, FiUpload } from 'react-icons/fi';

const TransactionForm = ({ type, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    toEmail: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Ingrese un monto válido');
      return;
    }
    onSubmit({ ...formData, amount });
  };

  const getConfig = () => {
    switch(type) {
      case 'deposit':
        return {
          title: 'Depositar Dinero',
          icon: <FiUpload />,
          buttonText: 'Depositar',
          fields: ['amount']
        };
      case 'withdraw':
        return {
          title: 'Retirar Dinero',
          icon: <FiDownload />,
          buttonText: 'Retirar',
          fields: ['amount']
        };
      case 'transfer':
        return {
          title: 'Transferir Dinero',
          icon: <FiSend />,
          buttonText: 'Transferir',
          fields: ['amount', 'toEmail', 'description']
        };
      default:
        return null;
    }
  };

  const config = getConfig();
  if (!config) return null;

  return (
    <div className="transaction-form">
      <div className="form-header">
        {config.icon}
        <h3>{config.title}</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        {config.fields.includes('amount') && (
          <div className="form-group">
            <label>Monto ($)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        )}
        
        {config.fields.includes('toEmail') && (
          <div className="form-group">
            <label>Email del destinatario</label>
            <input
              type="email"
              name="toEmail"
              value={formData.toEmail}
              onChange={handleChange}
              placeholder="usuario@email.com"
              required
            />
          </div>
        )}
        
        {config.fields.includes('description') && (
          <div className="form-group">
            <label>Descripción (opcional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Motivo de la transferencia"
              rows="3"
            />
          </div>
        )}
        
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Procesando...' : config.buttonText}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;