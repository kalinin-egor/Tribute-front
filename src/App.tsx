import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TelegramProvider } from './hooks/useTelegram';
import MonetizationPage from './pages/MonetizationPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

function App() {
  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      // Set the background color to white for the whole app
      window.Telegram.WebApp.setHeaderColor('#ffffff');
      window.Telegram.WebApp.setBackgroundColor('#ffffff');
    }
  }, []);

  return (
    <TelegramProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MonetizationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </Router>
    </TelegramProvider>
  );
}

export default App; 