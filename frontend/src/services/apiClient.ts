import axios, { AxiosInstance } from 'axios';

// Global reference to the loading context (will be set by App.tsx)
let globalLoadingContext: {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
} | null = null;

export const setGlobalLoadingContext = (context: {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}) => {
  globalLoadingContext = context;
};

// Create axios instance with global loading integration
const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token and show loading
  api.interceptors.request.use(
    (config) => {
      // Add auth token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Show loading for non-background requests
      if (globalLoadingContext && !config.metadata?.skipLoading) {
        const loadingMessage = config.metadata?.loadingMessage || 'Loading...';
        globalLoadingContext.showLoading(loadingMessage);
      }

      return config;
    },
    (error) => {
      if (globalLoadingContext) {
        globalLoadingContext.hideLoading();
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors and hide loading
  api.interceptors.response.use(
    (response) => {
      // Hide loading for non-background requests
      if (globalLoadingContext && !response.config.metadata?.skipLoading) {
        globalLoadingContext.hideLoading();
      }
      return response;
    },
    (error) => {
      // Hide loading on error
      if (globalLoadingContext && !error.config?.metadata?.skipLoading) {
        globalLoadingContext.hideLoading();
      }

      // Handle auth errors
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      skipLoading?: boolean;
      loadingMessage?: string;
    };
  }
}

export const api = createApiClient();