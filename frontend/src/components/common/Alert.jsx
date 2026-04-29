import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';

const Alert = ({ type, message, onClose }) => {
  const icons = {
    success: <FiCheckCircle />,
    error: <FiXCircle />,
    warning: <FiAlertCircle />,
    info: <FiInfo />
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">{icons[type]}</div>
      <div className="alert-message">{message}</div>
      {onClose && (
        <button onClick={onClose} className="alert-close">×</button>
      )}
    </div>
  );
};

export default Alert;