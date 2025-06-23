import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../hooks/useAppState';
import { useTelegram } from '../../hooks/useTelegram';
import { 
  sendDataToTelegram, 
  getWebAppInfo, 
  isTelegramWebApp, 
  sendDebugInfoToTelegram 
} from '../../../utils/helpers';
import styles from './CreatorDashboardPage.module.css';
import QuickActions from '../../Components/QuickActions/QuickActions';
import EarningsSummary from '../../Components/EarningsSummary/EarningsSummary';
import DashboardNav from '../../Components/DashboardNav/DashboardNav';
import PayoutAlert from '../../Components/PayoutAlert/PayoutAlert';
import VerifyAccountAlert from '../../Components/VerifyAccountAlert/VerifyAccountAlert';
import GettingStarted from '../../Components/GettingStarted/GettingStarted';
import MainMenu from '../../Components/MainMenu/MainMenu';
import TransactionsPlaceholder from '../../Components/TransactionsPlaceholder/TransactionsPlaceholder';

const CreatorDashboardPage: React.FC = () => {
  const { dashboardData, refreshDashboard } = useAppState();
  const { webApp, isReady } = useTelegram();
  const navigate = useNavigate();

  const handlePayoutClick = () => {
    navigate('/set-up-payouts');
  };

  // Функция для отправки verify-account
  const handleVerifyAccount = async () => {
    try {
      const success = await sendDataToTelegram('verify-account');
      if (success) {
        console.log('✅ verify-account отправлен успешно');
      } else {
        console.log('❌ Не удалось отправить verify-account');
      }
    } catch (error) {
      console.error('Error sending verify-account:', error);
    }
  };

  // Функция для отправки test-data
  const handleTestData = async () => {
    try {
      const success = await sendDataToTelegram('test-data');
      if (success) {
        console.log('✅ test-data отправлен успешно');
      } else {
        console.log('❌ Не удалось отправить test-data');
      }
    } catch (error) {
      console.error('Error sending test-data:', error);
    }
  };

  // Функция для отладки WebApp
  const handleDebugInfo = async () => {
    await sendDebugInfoToTelegram();
  };

  // Функция для прямой отправки данных (без проверок)
  const handleDirectSendData = async () => {
    try {
      console.log('🚀 Прямая отправка данных (без проверок)');
      
      if (!isTelegramWebApp()) {
        console.error('❌ WebApp недоступен');
        return;
      }
      
      console.log('📤 Вызываем window.Telegram.WebApp.sendData("direct-test") напрямую...');
      
      const result = window.Telegram.WebApp.sendData('direct-test');
      console.log(`✅ Прямой вызов выполнен, результат: ${result}`);
      console.log('✅ Данные "direct-test" отправлены напрямую');
      
      // Дополнительная проверка через небольшую задержку
      setTimeout(() => {
        console.log('⏰ Проверка через 3 секунды: данные "direct-test" должны быть получены ботом');
      }, 3000);
      
    } catch (error: any) {
      console.error(`❌ Ошибка при прямой отправке: ${error?.message || error}`);
      console.error(`🔍 Тип ошибки: ${typeof error}`);
    }
  };

  // Функция для тестирования разных типов данных
  const handleTestDifferentData = async () => {
    console.log('🧪 Тестирование разных типов данных');
    
    const testData = [
      'simple-text',
      '{"type": "test", "data": "json"}',
      'verify-account',
      'test-data',
      'custom-action'
    ];
    
    for (const data of testData) {
      try {
        console.log(`🔄 Тестируем данные: "${data}"`);
        
        const result = await window.Telegram.WebApp.sendData(data);
        console.log(`✅ "${data}" отправлен, результат: ${result}`);
      } catch (error: any) {
        console.error(`❌ Ошибка для "${data}": ${error?.message || error}`);
      }
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('✅ Тестирование завершено');
  };

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if card number is empty (not set up)
  const isCardNotSetUp = !dashboardData.card_number || dashboardData.card_number.trim() === '';

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Creator Dashboard</h1>
      
      <QuickActions 
        channels={dashboardData['channels-and-groups']}
        isSubPublished={dashboardData['is-sub-published']}
        onRefresh={refreshDashboard}
      />
      
      <EarningsSummary 
        earnings={dashboardData.earn}
        isVerified={dashboardData['is-verified']}
      />
      
      <DashboardNav />
      
      {/* Show VerifyAccountAlert and PayoutAlert only if card is not set up */}
      {!dashboardData['is-verified'] && (
        <>
          <VerifyAccountAlert onClick={handleVerifyAccount} />
        </>
      )}
      {isCardNotSetUp && (
        <>
          <PayoutAlert onClick={handlePayoutClick} />        
        </>
      )}


      {dashboardData['channels-and-groups'].length === 0 && (
        <GettingStarted />
      )}
      
      <MainMenu />
      
      <TransactionsPlaceholder 
        payments={dashboardData['payments-history']}
        subscriptions={dashboardData.subscriptions}
      />
    </div>
  );
};

export default CreatorDashboardPage; 