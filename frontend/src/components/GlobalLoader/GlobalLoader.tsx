import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';
import Loader from '../Loader/Loader';
import './GlobalLoader.css';

const GlobalLoader: React.FC = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="global-loader-content">
        <Loader size="large" color="#3b82f6" />
        <p className="global-loader-text">{loadingMessage}</p>
      </div>
    </div>
  );
};

export default GlobalLoader;