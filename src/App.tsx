import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthModal from './components/AuthModal';
import Header from './components/Header';
import ResetPassword from './components/ResetPassword';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated on app load
    const token = localStorage.getItem('authToken');
    return !!token;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (token?: string) => {
    if (token) {
      localStorage.setItem('authToken', token);
    }
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen">
      {!isDashboard && (
        <Header
          isAuthenticated={isAuthenticated}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onLogout={handleLogout}
        />
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <LandingPage onSignIn={handleSignIn} onSignUp={handleSignUp} />
          } 
        />
        <Route 
          path="/reset-password" 
          element={<ResetPassword />}
        />
        <Route 
          path="/dashboard/*" 
          element={
            isAuthenticated ? 
            <Dashboard onLogout={handleLogout} /> : 
            <Navigate to="/" />
          } 
        />
      </Routes>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          onModeSwitch={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;