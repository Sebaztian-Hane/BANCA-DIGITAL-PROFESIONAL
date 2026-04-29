import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints/admin.api';
import { accountAPI } from '../../api/endpoints/account.api';
import { FiArrowLeft, FiDollarSign, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingBalance, setEditingBalance] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceAction, setBalanceAction] = useState('add');

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUserDetails(userId);
      setUser(response.data.data.user);
      setStats(response.data.data.stats);
      setBalanceAmount(response.data.data.user.balance);
    } catch (error) {
      toast.error('Error al cargar detalles del usuario');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceUpdate = async () => {
    try {
      await adminAPI.updateUserBalance(
        userId, 
        parseFloat(balanceAmount), 
        balanceAction
      );
      toast.success(`Balance ${balanceAction === 'add' ? 'aumentado' : 'disminuido'} correctamente`);
      setEditingBalance(false);
      fetchUserDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar balance');
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando detalles...</div>;
  }

  if (!user) {
    return <div className="error-container">Usuario no encontrado</div>;
  }

  return (
    <div className="user-details">
      <div className="details-header">
        <button onClick={() => navigate('/admin/users')} className="back-btn">
          <FiArrowLeft /> Volver
        </button>
        <h1>Detalles del Usuario</h1>
      </div>

      <div className="details-grid">
        <div className="info-card">
          <h3>Información Personal</h3>
          <div className="info-row">
            <strong>Nombre:</strong> <span>{user.name}</span>
          </div>
          <div className="info-row">
            <strong>Email:</strong> <span>{user.email}</span>
          </div>
          <div className="info-row">
            <strong>DNI:</strong> <span>{user.dni}</span>
          </div>
          <div className="info-row">
            <strong>Teléfono:</strong> <span>{user.phone}</span>
          </div>
          <div className="info-row">
            <strong>Dirección:</strong> <span>{user.address || 'No registrada'}</span>
          </div>
          <div className="info-row">
            <strong>Rol:</strong> 
            <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
          </div>
          <div className="info-row">
            <strong>Estado:</strong>
            <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
              {user.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="info-row">
            <strong>Registrado:</strong> 
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="balance-card">
          <h3>Balance Actual</h3>
          {editingBalance ? (
            <div className="balance-edit">
              <select 
                value={balanceAction} 
                onChange={(e) => setBalanceAction(e.target.value)}
                className="balance-select"
              >
                <option value="add">Aumentar</option>
                <option value="subtract">Disminuir</option>
              </select>
              <input
                type="number"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                placeholder="Monto"
                className="balance-input"
              />
              <div className="balance-actions">
                <button onClick={handleBalanceUpdate} className="save-btn">
                  <FiSave /> Guardar
                </button>
                <button onClick={() => setEditingBalance(false)} className="cancel-btn">
                  <FiX /> Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="balance-display">
              <div className="balance-amount">
                ${user.balance?.toLocaleString()}
              </div>
              <button onClick={() => setEditingBalance(true)} className="edit-balance-btn">
                <FiEdit2 /> Ajustar Balance
              </button>
            </div>
          )}
        </div>

        <div className="stats-card">
          <h3>Estadísticas</h3>
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">Total Enviado</span>
              <span className="stat-value">${stats?.totalSent?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Recibido</span>
              <span className="stat-value">${stats?.totalReceived?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Transacciones</span>
              <span className="stat-value">{stats?.transactionCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <h3>Transacciones Recientes</h3>
        <div className="transactions-list">
          {user.sentTransactions?.slice(0, 10).map((tx) => (
            <div key={tx.id} className="transaction-item">
              <div className="transaction-type">
                {tx.type === 'TRANSFER' ? 'Transferencia' : tx.type}
              </div>
              <div className="transaction-details">
                {tx.type === 'TRANSFER' && (
                  <span>Para: {tx.receiver?.name}</span>
                )}
                {tx.description && <span>{tx.description}</span>}
              </div>
              <div className="transaction-amount negative">
                -${tx.amount}
              </div>
              <div className="transaction-date">
                {new Date(tx.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;