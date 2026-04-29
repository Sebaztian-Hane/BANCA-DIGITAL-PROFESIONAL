import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { accountAPI } from '../../api/endpoints/account.api';
import { transactionAPI } from '../../api/endpoints/transaction.api';
import BalanceCard from '../../components/dashboard/BalanceCard';
import TransactionForm from '../../components/dashboard/TransactionForm';
import TransactionList from '../../components/dashboard/TransactionList';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, updateUserBalance } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState({
    balance: false,
    transactions: false,
    deposit: false,
    withdraw: false,
    transfer: false
  });
  const [activeForm, setActiveForm] = useState(null);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    setLoading(prev => ({ ...prev, balance: true }));
    try {
      const response = await accountAPI.getBalance();
      setBalance(response.data.data.balance);
    } catch (error) {
      toast.error('Error al cargar el balance');
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  };

  const fetchTransactions = async () => {
    setLoading(prev => ({ ...prev, transactions: true }));
    try {
      const response = await transactionAPI.getHistory({ limit: 10 });
      setTransactions(response.data.data.transactions);
    } catch (error) {
      toast.error('Error al cargar transacciones');
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const handleDeposit = async ({ amount }) => {
    setLoading(prev => ({ ...prev, deposit: true }));
    try {
      const response = await accountAPI.deposit(amount);
      setBalance(response.data.data.balance);
      updateUserBalance(response.data.data.balance);
      await fetchTransactions();
      toast.success(`Depósito de $${amount} realizado con éxito`);
      setActiveForm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al depositar');
    } finally {
      setLoading(prev => ({ ...prev, deposit: false }));
    }
  };

  const handleWithdraw = async ({ amount }) => {
    setLoading(prev => ({ ...prev, withdraw: true }));
    try {
      const response = await accountAPI.withdraw(amount);
      setBalance(response.data.data.balance);
      updateUserBalance(response.data.data.balance);
      await fetchTransactions();
      toast.success(`Retiro de $${amount} realizado con éxito`);
      setActiveForm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al retirar');
    } finally {
      setLoading(prev => ({ ...prev, withdraw: false }));
    }
  };

  const handleTransfer = async ({ amount, toEmail, description }) => {
    setLoading(prev => ({ ...prev, transfer: true }));
    try {
      const response = await transactionAPI.transfer({ toEmail, amount, description });
      setBalance(response.data.data.balance);
      updateUserBalance(response.data.data.balance);
      await fetchTransactions();
      toast.success(`Transferencia de $${amount} a ${toEmail} realizada con éxito`);
      setActiveForm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al transferir');
    } finally {
      setLoading(prev => ({ ...prev, transfer: false }));
    }
  };

  const getFormHandler = () => {
    switch(activeForm) {
      case 'deposit': return handleDeposit;
      case 'withdraw': return handleWithdraw;
      case 'transfer': return handleTransfer;
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.name}</h1>
        <p>Gestiona tus finanzas de manera segura</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-left">
          <BalanceCard 
            balance={balance} 
            recentTransactions={transactions.slice(0, 3)}
          />
        </div>
        
        <div className="dashboard-right">
          <div className="action-buttons">
            <button 
              className={`action-btn ${activeForm === 'deposit' ? 'active' : ''}`}
              onClick={() => setActiveForm(activeForm === 'deposit' ? null : 'deposit')}
            >
              💰 Depositar
            </button>
            <button 
              className={`action-btn ${activeForm === 'withdraw' ? 'active' : ''}`}
              onClick={() => setActiveForm(activeForm === 'withdraw' ? null : 'withdraw')}
            >
              💸 Retirar
            </button>
            <button 
              className={`action-btn ${activeForm === 'transfer' ? 'active' : ''}`}
              onClick={() => setActiveForm(activeForm === 'transfer' ? null : 'transfer')}
            >
              📤 Transferir
            </button>
          </div>
          
          {activeForm && (
            <TransactionForm
              type={activeForm}
              onSubmit={getFormHandler()}
              loading={loading[activeForm]}
            />
          )}
        </div>
      </div>
      
      <div className="transactions-section">
        <TransactionList 
          transactions={transactions} 
          loading={loading.transactions}
        />
      </div>
    </div>
  );
};

export default Dashboard;