import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { setGlobalLoadingContext } from './services/apiClient';
import GlobalLoader from './components/GlobalLoader/GlobalLoader';

// Import components (we'll create these next)
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Import pages
import Landing from './pages/Landing/Landing';
import FreeTrial from './pages/FreeTrial/FreeTrial';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';
import Dashboard from './pages/Dashboard/Dashboard';
import WatchlistPage from './pages/Watchlist/Watchlist';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import MarketOverview from './pages/Market/MarketOverview';
import StockDetail from './pages/Market/StockDetail';
import Search from './pages/Search/Search';
import News from './pages/News/News';
import Portfolio from './pages/Portfolio/Portfolio';
import Analytics from './pages/Analytics/Analytics';

// App content component that has access to loading context
function AppContent() {
  const loadingContext = useLoading();

  // Set the global loading context for the API client
  useEffect(() => {
    setGlobalLoadingContext(loadingContext);
  }, [loadingContext]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/free-trial" element={<FreeTrial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          
          {/* Protected routes with layout */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="market" element={<MarketOverview />} />
            <Route path="search" element={<Search />} />
            <Route path="stock/:symbol" element={<StockDetail />} />
            <Route path="news" element={<News />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Global Loader */}
        <GlobalLoader />
      </div>
    </Router>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;