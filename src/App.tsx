import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TelegramProvider } from './Presentation/hooks/useTelegram';
import { AppStateProvider, useAppState } from './Presentation/hooks/useAppState';
import HomePage from './Presentation/Scenes/HomePage/HomePage';
import MonetizationPage from './Presentation/Scenes/MonetizationPage/MonetizationPage';
import ProfilePage from './Presentation/Scenes/ProfilePage/ProfilePage';
import CreatorDashboardPage from './Presentation/Scenes/CreatorDashboardPage/CreatorDashboardPage';
import ChannelsPage from './Presentation/Scenes/ChannelsPage/ChannelsPage';
import SetUpPayoutsPage from './Presentation/Scenes/SetUpPayoutsPage/SetUpPayoutsPage';
import Layout from './Presentation/Components/Layout';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

function AppContent() {
  const { isLoading, error, isOnboarded } = useAppState();

  if (isLoading) {
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

  return (
    <Layout>
      <Routes>
        {isOnboarded ? (
          <>
            <Route path="/dashboard" element={<CreatorDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/set-up-payouts" element={<SetUpPayoutsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/monetization" element={<MonetizationPage />} />
            <Route path="*" element={<Navigate to="/monetization" replace />} />
          </>
        )}
      </Routes>
    </Layout>
  );
}

function App() {
  console.log('App component rendering');
  return (
    <TelegramProvider>
      <Router>
        <AppStateProvider>
          <AppContent />
        </AppStateProvider>
      </Router>
    </TelegramProvider>
  );
}

export default App; 