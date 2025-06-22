import React, { useState, useEffect } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { useAppState } from '../../hooks/useAppState';
import FeatureItem from '../../Components/FeatureItem';
import Spinner from '../../Components/Spinner/Spinner';
import moneyDuckImage from '../../../assets/images/money-duck.png';
import { FaHeart, FaStar, FaBox, FaTruck, FaBroadcastTower, FaUsers, FaUser, FaChartBar } from 'react-icons/fa';
import { isTelegramWebApp } from '../../../utils/helpers';
import styles from './MonetizationPage.module.css';
import { MonetizationPageProps, Feature, MonetizationPageState, MonetizationPageHandlers } from './MonetizationPage.types';

const MonetizationPage: React.FC<MonetizationPageProps> = () => {
  const { webApp } = useTelegram();
  const { onboardUser } = useAppState();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

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

  const handleOnboarding = async () => {
    if (!termsAccepted || isOnboarding) return;

    setIsOnboarding(true);
    if (isTelegramWebApp() && webApp) {
      webApp.MainButton.showProgress();
    }

    try {
      await onboardUser();
    } catch (error) {
      console.error('Onboarding failed:', error);
      if (isTelegramWebApp() && webApp) {
        webApp.HapticFeedback.notificationOccurred('error');
      }
      alert('Ошибка при регистрации. Попробуйте еще раз.');
    } finally {
      setIsOnboarding(false);
      if (isTelegramWebApp() && webApp) {
        webApp.MainButton.hideProgress();
      }
    }
  };

  const handlers: MonetizationPageHandlers = {
    handleMonetizeClick: handleOnboarding,
    handleTermsChange: (accepted: boolean) => {
      setTermsAccepted(accepted);
    },
  };

  useEffect(() => {
    if (!webApp) return;

    webApp.MainButton.setText(isOnboarding ? 'Регистрация...' : 'Монетизироваться');
    webApp.MainButton.color = '#30a4fc';
    webApp.MainButton.onClick(handlers.handleMonetizeClick);
    webApp.MainButton.show();

    return () => {
      webApp.MainButton.offClick(handlers.handleMonetizeClick);
      webApp.MainButton.hide();
    };
  }, [webApp, isOnboarding, handlers.handleMonetizeClick]);

  useEffect(() => {
    if (!webApp) return;
    
    if (termsAccepted && !isOnboarding) {
      webApp.MainButton.enable();
    } else {
      webApp.MainButton.disable();
    }
  }, [termsAccepted, isOnboarding, webApp]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <img 
            src={moneyDuckImage} 
            alt="Monetize your audience" 
            className={styles.heroImage}
          />
          
          <h1 className={styles.title}>Монетизируйте вашу аудиторию</h1>
          <p className={styles.subtitle}>
            Настройте платежи и доступ к вашему контенту в Telegram
          </p>
        </div>

        <div className={styles.featuresContainer}>
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

        <div className={styles.termsContainer}>
          <input 
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => handlers.handleTermsChange(e.target.checked)}
            className={styles.termsCheckbox}
            disabled={isOnboarding}
          />
          <label htmlFor="terms" className={styles.termsLabel}>
            Я принимаю <a href="#" className={styles.termsLink}>условия использования</a>
          </label>
        </div>
      </div>
      
      {/* Fallback button for non-Telegram environments */}
      {!isTelegramWebApp() && (
        <div className={styles.fallbackButton}>
           <div className={styles.fallbackButtonContent}>
              <button
                onClick={handlers.handleMonetizeClick}
                disabled={!termsAccepted || isOnboarding}
                className={`${styles.fallbackButtonElement} ${
                  termsAccepted && !isOnboarding
                    ? styles.fallbackButtonElementEnabled
                    : styles.fallbackButtonElementDisabled
                }`}
              >
                {isOnboarding ? (
                  <>
                    <Spinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Регистрация...
                  </>
                ) : (
                  'Монетизироваться'
                )}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MonetizationPage; 
