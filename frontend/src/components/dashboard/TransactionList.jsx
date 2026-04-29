import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiArrowUpRight, FiArrowDownLeft, FiRefreshCw } from 'react-icons/fi';

const TransactionList = ({ transactions, loading }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'DEPOSIT':
        return <FiArrowDownLeft className="icon-deposit" />;
      case 'WITHDRAWAL':
        return <FiArrowUpRight className="icon-withdrawal" />;
      case 'TRANSFER':
        return <FiRefreshCw className="icon-transfer" />;
      default:
        return null;
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'DEPOSIT': return 'Depósito';
      case 'WITHDRAWAL': return 'Retiro';
      case 'TRANSFER': return 'Transferencia';
      default: return type;
    }
  };

  if (loading && transactions.length === 0) {
    return <div className="transactions-loading">Cargando transacciones...</div>;
  }

  if (transactions.length === 0) {
    return <div className="transactions-empty">No hay transacciones registradas</div>;
  }

  return (
    <div className="transactions-list">
      <h3>Historial de Transacciones</h3>
      <div className="transactions-container">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-icon">
              {getIcon(transaction.type)}
            </div>
            <div className="transaction-details">
              <div className="transaction-header">
                <span className="transaction-type">
                  {getTypeText(transaction.type)}
                </span>
                <span className="transaction-date">
                  {format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm", { locale: es })}
                </span>
              </div>
              <div className="transaction-info">
                {transaction.type === 'TRANSFER' && (
                  <span className="transaction-counterparty">
                    {transaction.senderId === transaction.sender?.id 
                      ? `Para: ${transaction.receiver?.name}`
                      : `De: ${transaction.sender?.name}`}
                  </span>
                )}
                {transaction.description && (
                  <span className="transaction-description">
                    {transaction.description}
                  </span>
                )}
              </div>
            </div>
            <div className={`transaction-amount ${transaction.type === 'DEPOSIT' ? 'positive' : 'negative'}`}>
              {transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;