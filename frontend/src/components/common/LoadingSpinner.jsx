// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'در حال بارگذاری...' }) => {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div className="loading">
      <div 
        className="spinner" 
        style={{ 
          width: sizes[size], 
          height: sizes[size] 
        }}
      ></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;