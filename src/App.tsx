import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TelegramProvider } from './Presentation/hooks/useTelegram';
import { useAppState } from './Presentation/hooks/useAppState';
import HomePage from './Presentation/Scenes/HomePage/HomePage';
import MonetizationPage from './Presentation/Scenes/MonetizationPage/MonetizationPage';
import ProfilePage from './Presentation/Scenes/ProfilePage/ProfilePage';
import CreatorDashboardPage from './Presentation/Scenes/CreatorDashboardPage/CreatorDashboardPage';
import TestPage from './Presentation/Scenes/TestPage/TestPage';
import Layout from './Presentation/Components/Layout';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

function AppContent() {
  const { isLoading, error, isOnboarded, dashboardData } = useAppState();

  useEffect(() => {
    console.log('AppContent mounted');
    console.log('App state:', { isLoading, error, isOnboarded, hasDashboardData: !!dashboardData });
    
    // Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
      console.log('Initializing Telegram WebApp...');
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      // Set the background color to white for the whole app
      window.Telegram.WebApp.setHeaderColor('#ffffff');
      window.Telegram.WebApp.setBackgroundColor('#ffffff');
      console.log('Telegram WebApp initialized');
    } else {
      console.log('Telegram WebApp not available in AppContent');
    }
  }, []);

  console.log('AppContent render:', { isLoading, error, isOnboarded, hasDashboardData: !!dashboardData });

  if (isLoading) {
    console.log('Showing loading screen');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('Showing error screen:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering main app content');
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/monetization" element={<MonetizationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<CreatorDashboardPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  console.log('App component rendering');
  return (
    <TelegramProvider>
      <Router>
        <AppContent />
      </Router>
    </TelegramProvider>
  );
}

export default App; 