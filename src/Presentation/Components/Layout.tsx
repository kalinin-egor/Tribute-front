import React from 'react';
import { useTelegram } from '../hooks/useTelegram';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, themeParams } = useTelegram();

  return (
    <div 
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
      style={{
        backgroundColor: themeParams.bg_color || undefined,
        color: themeParams.text_color || undefined,
      }}
    >
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 