import React, { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import FeatureItem from '../components/FeatureItem';
import moneyDuckImage from '../assets/images/money-duck.png';

// Icons from react-icons
import { FaHeart, FaStar, FaBox, FaTruck, FaBroadcastTower, FaUsers, FaUser, FaChartBar } from 'react-icons/fa';

const features = [
  {
    icon: <FaHeart className="w-6 h-6 text-white" />,
    iconBgColor: 'bg-red-500',
    title: 'Донаты',
    description: 'Подключите разные типы донатов: разовые или регулярные.',
  },
  {
    icon: <FaStar className="w-6 h-6 text-white" />,
    iconBgColor: 'bg-blue-500',
    title: 'Подписки',
    description: 'Настройте разные уровни подписки на уникальный контент.',
  },
  {
    icon: <FaBox className="w-6 h-6 text-white" />,
    iconBgColor: 'bg-purple-500',
    title: 'Цифровые товары',
    description: 'Создайте цифровые товары, чтобы продавать отдельные виды контента.',
  },
  {
    icon: <FaTruck className="w-6 h-6 text-white" />,
    iconBgColor: 'bg-teal-500',
    title: 'Физические товары',
    description: 'Создайте простой онлайн-магазин для своего комьюнити.',
  },
  {
    icon: <FaBroadcastTower className="w-6 h-6 text-white" />,
    iconBgColor: 'bg-pink-500',
    title: 'Частные каналы',
    description: 'Принимайте платежи и предоставляйте доступ к контенту с помощью бота.',
  },
  {
    icon: <FaUsers className="w-6 h-6 text-white" />,
    iconBgColor: 'bg-blue-400',
    title: 'Частные группы',
    description: 'Монетизируйте ваши группы и разрешите боту управлять доступом.',
  },
  {
    icon: <FaUser className="w-6 h-6 text-white" />,
    iconBgColor: 'bg-red-400',
    title: 'Профиль автора',
    description: 'Настройте монетизацию и выплаты в удобном разделе.',
  },
  {
    icon: <FaChartBar className="w-6 h-6 text-white" />,
    iconBgColor: 'bg-indigo-500',
    title: 'Подробная статистика',
    description: 'Следите за вашей статистикой: доходами и активностью подписчиков.',
  },
];

const MonetizationPage: React.FC = () => {
  const { webApp } = useTelegram();
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (!webApp) return;

    const handleMainButtonClick = () => {
      // Handle monetization logic here
      webApp.HapticFeedback.notificationOccurred('success');
      webApp.close();
    };
    
    webApp.MainButton.setText('Монетизироваться');
    webApp.MainButton.color = '#30a4fc';
    webApp.MainButton.onClick(handleMainButtonClick);
    webApp.MainButton.show();
    
    // Cleanup on component unmount
    return () => {
      webApp.MainButton.offClick(handleMainButtonClick);
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
              icon={feature.icon}
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
    </div>
  );
};

export default MonetizationPage; 