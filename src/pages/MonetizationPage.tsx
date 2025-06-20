import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import FeatureItem from '../components/FeatureItem';
import moneyDuckImage from '../assets/images/money-duck.png';
import { FaHeart, FaStar, FaBox, FaTruck, FaBroadcastTower, FaUsers, FaUser, FaChartBar } from 'react-icons/fa';
import { isTelegramWebApp } from '../utils/helpers';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FaHeart as React.ComponentType<{ className?: string }>,
    iconBgColor: 'bg-red-500',
    title: 'Донаты',
    description: 'Подключите разные типы донатов: разовые или регулярные.',
  },
  {
    icon: FaStar as React.ComponentType<{ className?: string }>,
    iconBgColor: 'bg-blue-500',
    title: 'Подписки',
    description: 'Настройте разные уровни подписки на уникальный контент.',
  },
  {
    icon: FaBox as React.ComponentType<{ className?: string }>,
    iconBgColor: 'bg-purple-500',
    title: 'Цифровые товары',
    description: 'Создайте цифровые товары, чтобы продавать отдельные виды контента.',
  },
  {
    icon: FaTruck as React.ComponentType<{ className?: string }>,
    iconBgColor: 'bg-teal-500',
    title: 'Физические товары',
    description: 'Создайте простой онлайн-магазин для своего комьюнити.',
  },
  {
    icon: FaBroadcastTower as React.ComponentType<{ className?: string }>,
    iconBgColor: 'bg-pink-500',
    title: 'Частные каналы',
    description: 'Принимайте платежи и предоставляйте доступ к контенту с помощью бота.',
  },
  {
    icon: FaUsers as React.ComponentType<{ className?: string }>,
    iconBgColor: 'bg-blue-400',
    title: 'Частные группы',
    description: 'Монетизируйте ваши группы и разрешите боту управлять доступом.',
  },
  {
    icon: FaUser as React.ComponentType<{ className?: string }>,
    iconBgColor: 'bg-red-400',
    title: 'Профиль автора',
    description: 'Настройте монетизацию и выплаты в удобном разделе.',
  },
  {
    icon: FaChartBar as React.ComponentType<{ className?: string }>,
    iconBgColor: 'bg-indigo-500',
    title: 'Подробная статистика',
    description: 'Следите за вашей статистикой: доходами и активностью подписчиков.',
  },
];

const MonetizationPage: React.FC = () => {
  const { webApp } = useTelegram();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleMonetizeClick = () => {
    if (webApp) {
      webApp.HapticFeedback.notificationOccurred('success');
      webApp.close();
    } else {
      // Fallback for browser environment
      alert('Monetization successful!');
      console.log('Monetization logic triggered in browser.');
    }
  };

  useEffect(() => {
    if (!webApp) return;

    webApp.MainButton.setText('Монетизироваться');
    webApp.MainButton.color = '#30a4fc';
    webApp.MainButton.onClick(handleMonetizeClick);
    webApp.MainButton.show();

    return () => {
      webApp.MainButton.offClick(handleMonetizeClick);
      webApp.MainButton.hide();
    };
  }, [webApp]);

  useEffect(() => {
    if (!webApp) return;
    
    if (termsAccepted) {
      webApp.MainButton.enable();
    } else {
      webApp.MainButton.disable();
    }
  }, [termsAccepted, webApp]);


  return (
    <div className="bg-white min-h-screen text-gray-900 px-4 sm:px-6 lg:px-8 pt-8 pb-24">
      <div className="max-w-xl mx-auto">
        <div className="text-center space-y-4">
          <img 
            src={moneyDuckImage} 
            alt="Monetize your audience" 
            className="mx-auto w-36 h-36 sm:w-40 sm:h-40"
          />
          
          <h1 className="text-2xl sm:text-3xl font-bold">Монетизируйте вашу аудиторию</h1>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
            Настройте платежи и доступ к вашему контенту в Telegram
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              IconComponent={feature.icon}
              iconBgColor={feature.iconBgColor}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center space-x-3">
          <input 
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="h-6 w-6 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="terms" className="text-gray-700 text-sm sm:text-base">
            Я принимаю <a href="#" className="text-blue-600 hover:underline">условия использования</a>
          </label>
        </div>
      </div>
      
      {/* Fallback button for non-Telegram environments */}
      {!isTelegramWebApp() && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
           <div className="max-w-xl mx-auto">
              <button
                onClick={handleMonetizeClick}
                disabled={!termsAccepted}
                className={`w-full py-3 px-4 font-semibold rounded-lg transition-colors duration-200 ${
                  termsAccepted 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Монетизироваться
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MonetizationPage; 
