import React from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const BalanceCard = ({ balance, recentTransactions = [] }) => {
  const lastTransactions = recentTransactions.slice(0, 3);
  
  return (
    <div className="balance-card">
      <div className="balance-header">
        <FiDollarSign className="balance-icon" />
        <h3>Saldo Actual</h3>
      </div>
      <div className="balance-amount">
        ${balance?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
      </div>
      
      {lastTransactions.length > 0 && (
        <div className="recent-activity">
          <h4>Actividad reciente</h4>
          {lastTransactions.map((tx, index) => (
            <div key={index} className="activity-item">
              {tx.type === 'DEPOSIT' ? (
                <FiTrendingUp className="activity-icon deposit" />
              ) : (
                <FiTrendingDown className="activity-icon withdrawal" />
              )}
              <div className="activity-details">
                <span className="activity-type">{tx.type}</span>
                <span className="activity-amount ${tx.type === 'DEPOSIT' ? 'positive' : 'negative'}">
                  {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BalanceCard;