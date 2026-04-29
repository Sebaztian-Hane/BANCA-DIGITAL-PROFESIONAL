import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/endpoints/admin.api';
import { FiUsers, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers()
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Usuarios Totales',
      value: stats?.users?.total || 0,
      icon: <FiUsers />,
      color: '#4299e1',
      change: '+12%'
    },
    {
      title: 'Balance Total',
      value: `$${stats?.system?.totalBalance?.toLocaleString() || 0}`,
      icon: <FiDollarSign />,
      color: '#48bb78',
      change: '+5%'
    },
    {
      title: 'Transacciones',
      value: stats?.transactions?.total || 0,
      icon: <FiActivity />,
      color: '#ed8936',
      change: '+23%'
    },
    {
      title: 'Volumen Total',
      value: `$${(stats?.transactions?.totalDeposits + stats?.transactions?.totalWithdrawals + stats?.transactions?.totalTransfers)?.toLocaleString() || 0}`,
      icon: <FiTrendingUp />,
      color: '#9f7aea',
      change: '+18%'
    }
  ];

  // Datos de ejemplo para gráficos (en producción vendrían de la API)
  const chartData = [
    { month: 'Ene', depositos: 4000, retiros: 2400, transferencias: 1800 },
    { month: 'Feb', depositos: 3000, retiros: 1398, transferencias: 2200 },
    { month: 'Mar', depositos: 5000, retiros: 3800, transferencias: 2900 },
    { month: 'Abr', depositos: 4780, retiros: 3908, transferencias: 3500 },
    { month: 'May', depositos: 5890, retiros: 4800, transferencias: 4100 },
    { month: 'Jun', depositos: 6390, retiros: 5800, transferencias: 4900 },
  ];

  if (loading) {
    return <div className="loading-container">Cargando dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Gestiona usuarios, transacciones y estadísticas del sistema</p>
      </div>

      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <span className="stat-change positive">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Volumen de Transacciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="depositos" stroke="#4299e1" name="Depósitos" />
              <Line type="monotone" dataKey="retiros" stroke="#ed8936" name="Retiros" />
              <Line type="monotone" dataKey="transferencias" stroke="#48bb78" name="Transferencias" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Distribución de Transacciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="depositos" fill="#4299e1" name="Depósitos" />
              <Bar dataKey="retiros" fill="#ed8936" name="Retiros" />
              <Bar dataKey="transferencias" fill="#48bb78" name="Transferencias" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-users">
        <h3>Usuarios Recientes</h3>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>DNI</th>
                <th>Balance</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.dni}</td>
                  <td>${user.balance.toLocaleString()}</td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;