import React from 'react';
import './Loader.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  color = '#3b82f6', 
  text,
  className = '' 
}) => {
  return (
    <div className={`loader-container ${className}`}>
      <div className={`spinner spinner-${size}`} style={{ borderTopColor: color }}>
        <div className="spinner-inner"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;