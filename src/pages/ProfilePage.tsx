import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '@/hooks/useTelegram';

const ProfilePage: React.FC = () => {
  const { webApp, user, isReady } = useTelegram();
  const navigate = useNavigate();

  useEffect(() => {
    if (webApp && isReady) {
      // Set up back button
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        navigate('/');
      });

      // Hide main button on this page
      webApp.MainButton.hide();

      return () => {
        webApp.BackButton.hide();
      };
    }
  }, [webApp, isReady, navigate]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary-600 mb-2">
          Profile
        </h1>
      </div>

      {/* User Profile */}
      {user && (
        <div className="card">
          <div className="flex items-center space-x-4 mb-4">
            {user.photo_url ? (
              <img 
                src={user.photo_url} 
                alt={user.first_name}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {user.first_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="font-semibold text-xl">
                {user.first_name} {user.last_name || ''}
              </h2>
              {user.username && (
                <p className="text-gray-600">@{user.username}</p>
              )}
              {user.language_code && (
                <p className="text-sm text-gray-500">
                  Language: {user.language_code.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Stats */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Profile Statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Tributes</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tributes Received</span>
            <span className="font-semibold text-green-600">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tributes Given</span>
            <span className="font-semibold text-purple-600">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Member Since</span>
            <span className="font-semibold">Today</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Settings</h3>
        <div className="space-y-3">
          <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM20 5h-6v2h6V5zM4 5h6v2H4V5z" />
                </svg>
                <span>Notifications</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Privacy</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Help & Support</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* About */}
      <div className="text-center text-sm text-gray-500">
        <p>Tribute v1.0.0</p>
        <p>Built for Telegram Mini Apps</p>
      </div>
    </div>
  );
};

export default ProfilePage; 