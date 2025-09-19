import axios, { AxiosResponse } from 'axios';
import {
  User,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  ChangePasswordForm,
  AuthResponse,
  ApiResponse,
} from '../types';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class AuthService {
  // Register new user
  static async register(data: RegisterForm): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Login user
  static async login(data: LoginForm): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if request fails
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('token');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<{ success: boolean; user: User }> = await api.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  }

  // Update user profile
  static async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response: AxiosResponse<{ success: boolean; user: User }> = await api.put('/auth/profile', data);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  // Update user preferences
  static async updatePreferences(preferences: Partial<User['preferences']>): Promise<User['preferences']> {
    try {
      const response: AxiosResponse<{ success: boolean; preferences: User['preferences'] }> = 
        await api.put('/auth/preferences', preferences);
      return response.data.preferences;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update preferences');
    }
  }

  // Change password
  static async changePassword(data: ChangePasswordForm): Promise<void> {
    try {
      await api.put('/auth/change-password', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  // Forgot password
  static async forgotPassword(data: ForgotPasswordForm): Promise<void> {
    try {
      await api.post('/auth/forgot-password', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  }

  // Reset password
  static async resetPassword(token: string, data: ResetPasswordForm): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.put(`/auth/reset-password/${token}`, data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }

  // Verify email
  static async verifyEmail(token: string): Promise<void> {
    try {
      await api.put(`/auth/verify-email/${token}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify email');
    }
  }

  // Add stock to watchlist
  static async addToWatchlist(symbol: string): Promise<User['preferences']['watchlist']> {
    try {
      const response: AxiosResponse<{ 
        success: boolean; 
        watchlist: User['preferences']['watchlist'] 
      }> = await api.post('/auth/watchlist', { symbol });
      
      return response.data.watchlist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add to watchlist');
    }
  }

  // Remove stock from watchlist
  static async removeFromWatchlist(symbol: string): Promise<User['preferences']['watchlist']> {
    try {
      const response: AxiosResponse<{ 
        success: boolean; 
        watchlist: User['preferences']['watchlist'] 
      }> = await api.delete(`/auth/watchlist/${symbol}`);
      
      return response.data.watchlist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from watchlist');
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get stored token
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Admin functions
  static async getUsers(page = 1, limit = 10): Promise<any> {
    try {
      const response = await api.get(`/auth/users?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  }

  static async updateUserRole(userId: string, role: string): Promise<void> {
    try {
      await api.put(`/auth/users/${userId}/role`, { role });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user role');
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/auth/users/${userId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  static async getStats(): Promise<any> {
    try {
      const response = await api.get('/auth/stats');
      return response.data.stats;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get statistics');
    }
  }
}

export default AuthService;