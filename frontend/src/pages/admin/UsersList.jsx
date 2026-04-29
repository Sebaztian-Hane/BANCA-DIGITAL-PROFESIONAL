import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/endpoints/admin.api';
import { FiEye, FiEdit2, FiUserX, FiUserCheck, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, !currentStatus);
      toast.success(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} correctamente`);
      fetchUsers();
    } catch (error) {
      toast.error('Error al cambiar estado del usuario');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.dni.includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'ADMIN': return 'role-admin';
      case 'EMPLOYEE': return 'role-employee';
      default: return 'role-client';
    }
  };

  return (
    <div className="users-list-container">
      <div className="users-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra todos los usuarios del sistema bancario</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">Todos los roles</option>
            <option value="CLIENT">Clientes</option>
            <option value="EMPLOYEE">Empleados</option>
            <option value="ADMIN">Administradores</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Cargando usuarios...</div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-full-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Contacto</th>
                <th>DNI</th>
                <th>Balance</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Transacciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-date">
                          Registrado: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{user.email}</div>
                    <div className="user-phone">{user.phone}</div>
                  </td>
                  <td>{user.dni}</td>
                  <td className="balance-cell">
                    ${user.balance?.toLocaleString() || 0}
                  </td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                    >
                      {user.isActive ? (
                        <>
                          <FiUserCheck /> Activo
                        </>
                      ) : (
                        <>
                          <FiUserX /> Inactivo
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="transaction-stats">
                      <div>Enviadas: {user._count?.sentTransactions || 0}</div>
                      <div>Recibidas: {user._count?.receivedTransactions || 0}</div>
                    </div>
                  </td>
                  <td>
                    <Link to={`/admin/users/${user.id}`} className="action-btn view-btn">
                      <FiEye /> Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;