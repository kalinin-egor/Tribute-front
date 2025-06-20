import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '@/hooks/useTelegram';

const HomePage: React.FC = () => {
  const { webApp, user, isReady } = useTelegram();
  const navigate = useNavigate();

  useEffect(() => {
    if (webApp && isReady) {
      // Set up main button
      webApp.MainButton.setText('View Profile');
      webApp.MainButton.show();
      webApp.MainButton.onClick(() => {
        navigate('/profile');
      });

      return () => {
        webApp.MainButton.hide();
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
        <h1 className="text-3xl font-bold text-primary-600 mb-2">
          Tribute
        </h1>
        <p className="text-gray-600">
          Welcome to your personal tribute collection
        </p>
      </div>

      {/* User Welcome */}
      {user && (
        <div className="card">
          <div className="flex items-center space-x-4">
            {user.photo_url && (
              <img 
                src={user.photo_url} 
                alt={user.first_name}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <h2 className="font-semibold text-lg">
                Hello, {user.first_name}!
              </h2>
              <p className="text-gray-600 text-sm">
                {user.username ? `@${user.username}` : 'Welcome to Tribute'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => navigate('/profile')}
            className="card hover:shadow-md transition-shadow duration-200 text-left"
          >
            <div className="text-primary-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="font-medium">Profile</h4>
            <p className="text-sm text-gray-600">View your profile</p>
          </button>

          <button 
            className="card hover:shadow-md transition-shadow duration-200 text-left"
          >
            <div className="text-green-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="font-medium">New Tribute</h4>
            <p className="text-sm text-gray-600">Create a tribute</p>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Your Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">0</div>
            <div className="text-sm text-gray-600">Tributes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Received</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Given</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 