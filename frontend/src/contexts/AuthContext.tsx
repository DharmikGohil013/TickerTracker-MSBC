import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AppState } from '../types';
import { AuthService } from '../services/authService';
import toast from 'react-hot-toast';

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
function authReducer(state: AppState, action: AuthAction): AppState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Context type
interface AuthContextType extends AppState {
  login: (identifier: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  addToWatchlist: (symbol: string) => Promise<void>;
  removeFromWatchlist: (symbol: string) => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = AuthService.getToken();
        if (token) {
          dispatch({ type: 'AUTH_START' });
          const user = await AuthService.getCurrentUser();
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: 'Not authenticated' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication check failed' });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (identifier: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await AuthService.login({ identifier, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      toast.success('Successfully logged in!');
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Register function
  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await AuthService.register(userData);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      toast.success('Account created successfully! Please verify your email.');
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      dispatch({ type: 'LOGOUT' });
      toast.success('Successfully logged out!');
    } catch (error: any) {
      // Dispatch logout even if API call fails
      dispatch({ type: 'LOGOUT' });
      toast.error('Logout failed, but you have been logged out locally');
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await AuthService.updateProfile(data);
      console.log('AuthContext: Received updated user:', updatedUser); // Debug log
      console.log('AuthContext: Current user state:', state.user); // Debug log
      
      // Validate that we have essential user data
      if (!updatedUser || !updatedUser.id) {
        console.error('AuthContext: Invalid user data received:', updatedUser);
        throw new Error('Invalid user data received from server');
      }
      
      // Ensure we maintain all existing user data and properly merge the update
      const mergedUser = {
        ...state.user, // Start with existing user data
        ...updatedUser, // Override with updated data
        // Ensure preferences exist
        preferences: {
          ...(state.user?.preferences || {}), // Keep existing preferences
          ...(updatedUser.preferences || {}), // Override with updated preferences if they exist
          // Provide defaults for missing preferences
          defaultCurrency: updatedUser.preferences?.defaultCurrency || state.user?.preferences?.defaultCurrency || 'USD',
          watchlist: updatedUser.preferences?.watchlist || state.user?.preferences?.watchlist || [],
          portfolios: updatedUser.preferences?.portfolios || state.user?.preferences?.portfolios || [],
          notifications: {
            ...(state.user?.preferences?.notifications || {}),
            ...(updatedUser.preferences?.notifications || {}),
            priceAlerts: updatedUser.preferences?.notifications?.priceAlerts ?? state.user?.preferences?.notifications?.priceAlerts ?? true,
            portfolioUpdates: updatedUser.preferences?.notifications?.portfolioUpdates ?? state.user?.preferences?.notifications?.portfolioUpdates ?? true,
            marketNews: updatedUser.preferences?.notifications?.marketNews ?? state.user?.preferences?.notifications?.marketNews ?? false,
            emailNotifications: updatedUser.preferences?.notifications?.emailNotifications ?? state.user?.preferences?.notifications?.emailNotifications ?? true
          },
          riskTolerance: updatedUser.preferences?.riskTolerance || state.user?.preferences?.riskTolerance || 'moderate',
          investmentExperience: updatedUser.preferences?.investmentExperience || state.user?.preferences?.investmentExperience || 'beginner'
        }
      };
      
      console.log('AuthContext: Merged user data:', mergedUser); // Debug log
      dispatch({ type: 'UPDATE_USER', payload: mergedUser });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('AuthContext: Profile update error:', error);
      const errorMessage = error.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update preferences function
  const updatePreferences = async (preferences: Partial<User['preferences']>): Promise<void> => {
    try {
      const updatedPreferences = await AuthService.updatePreferences(preferences);
      if (state.user) {
        const updatedUser = {
          ...state.user,
          preferences: updatedPreferences,
        };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
      toast.success('Preferences updated successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update preferences';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await AuthService.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to change password';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await AuthService.forgotPassword({ email });
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send reset email';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (token: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await AuthService.resetPassword(token, { password });
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      toast.success('Password reset successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to reset password';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Verify email function
  const verifyEmail = async (token: string): Promise<void> => {
    try {
      await AuthService.verifyEmail(token);
      // Refresh user data to get updated verification status
      if (state.user) {
        const updatedUser = await AuthService.getCurrentUser();
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
      toast.success('Email verified successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Email verification failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Add to watchlist function
  const addToWatchlist = async (symbol: string): Promise<void> => {
    try {
      const updatedWatchlist = await AuthService.addToWatchlist(symbol);
      if (state.user) {
        const updatedUser = {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            watchlist: updatedWatchlist,
          },
        };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
      toast.success(`${symbol} added to watchlist!`);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add to watchlist';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Remove from watchlist function
  const removeFromWatchlist = async (symbol: string): Promise<void> => {
    try {
      const updatedWatchlist = await AuthService.removeFromWatchlist(symbol);
      if (state.user) {
        const updatedUser = {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            watchlist: updatedWatchlist,
          },
        };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
      toast.success(`${symbol} removed from watchlist!`);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to remove from watchlist';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    addToWatchlist,
    removeFromWatchlist,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;