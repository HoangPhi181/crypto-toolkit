import React, { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="toast" style={{ color: type === 'error' ? '#f87171' : '#34d399' }}>
      {type === 'success' ? '✅ ' : '⚠ '}
      {message}
    </div>
  );
};

export default Toast;
