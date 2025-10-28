// src/components/common/ConfirmationModal.jsx
import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "تأیید عملیات",
  message = "آیا از انجام این عمل اطمینان دارید؟",
  confirmText = "تأیید",
  cancelText = "انصراف",
  type = "warning"
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '⚠️';
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger': return 'btn-danger';
      case 'success': return 'btn-success';
      case 'info': return 'btn-primary';
      default: return 'btn-warning';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <div className="modal-header">
          <div className="modal-icon">{getIcon()}</div>
          <h3>{title}</h3>
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${getConfirmButtonClass()}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;