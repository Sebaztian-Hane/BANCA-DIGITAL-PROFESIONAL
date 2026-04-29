import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../../api/endpoints/transaction.api';
import TransactionList from '../../components/dashboard/TransactionList';
import { FiSearch, FiFilter } from 'react-icons/fi';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getHistory({ limit: 100 });
      setTransactions(response.data.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.type !== filter.toUpperCase()) {
      return false;
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.description?.toLowerCase().includes(searchLower) ||
        transaction.receiver?.email?.toLowerCase().includes(searchLower) ||
        transaction.sender?.email?.toLowerCase().includes(searchLower) ||
        transaction.receiver?.name?.toLowerCase().includes(searchLower) ||
        transaction.sender?.name?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getFilterLabel = (filterValue) => {
    const labels = {
      all: 'Todas',
      DEPOSIT: 'Depósitos',
      WITHDRAWAL: 'Retiros',
      TRANSFER: 'Transferencias'
    };
    return labels[filterValue] || filterValue;
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Historial de Transacciones</h1>
        <p>Consulta todas tus operaciones bancarias</p>
      </div>

      <div className="transactions-filters">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por descripción, email o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <FiFilter className="filter-icon" />
          {['all', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map((filterOption) => (
            <button
              key={filterOption}
              className={`filter-btn ${filter === filterOption ? 'active' : ''}`}
              onClick={() => setFilter(filterOption)}
            >
              {getFilterLabel(filterOption)}
            </button>
          ))}
        </div>
      </div>

      <TransactionList 
        transactions={filteredTransactions} 
        loading={loading}
      />
    </div>
  );
};

export default Transactions;