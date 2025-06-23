import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../hooks/useAppState';
import { useTelegram } from '../../hooks/useTelegram';
import { 
  sendDataToTelegram, 
  getWebAppInfo, 
  isTelegramWebApp, 
  sendLogToTelegram, 
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
  const handleVerifyClick = async () => {
    await sendLogToTelegram('🔄 Нажата кнопка Verify Account');
    const success = await sendDataToTelegram('verify-account');
    if (success) {
      await sendLogToTelegram('✅ verify-account отправлен успешно');
    } else {
      await sendLogToTelegram('❌ Не удалось отправить verify-account');
    }
  };

  // Функция для отправки test-data
  const handleTestData = async () => {
    await sendLogToTelegram('🔄 Нажата кнопка Test Data');
    const success = await sendDataToTelegram('test-data');
    if (success) {
      await sendLogToTelegram('✅ test-data отправлен успешно');
    } else {
      await sendLogToTelegram('❌ Не удалось отправить test-data');
    }
  };

  // Функция для отладки WebApp
  const debugWebApp = async () => {
    await sendLogToTelegram('🔍 Запрошена отладочная информация');
    
    console.log('🔍 Debugging WebApp state:');
    console.log('isTelegramWebApp:', isTelegramWebApp());
    console.log('WebApp Info:', getWebAppInfo());
    console.log('window.Telegram:', window.Telegram);
    console.log('window.Telegram?.WebApp:', window.Telegram?.WebApp);
    console.log('window.Telegram?.WebApp?.sendData:', window.Telegram?.WebApp?.sendData);
    console.log('typeof sendData:', typeof window.Telegram?.WebApp?.sendData);
    
    if (window.Telegram?.WebApp) {
      console.log('WebApp.initData:', window.Telegram.WebApp.initData ? 'present' : 'missing');
      console.log('WebApp.initDataUnsafe:', window.Telegram.WebApp.initDataUnsafe);
      console.log('WebApp.version:', window.Telegram.WebApp.version);
      console.log('WebApp.platform:', window.Telegram.WebApp.platform);
    }
    
    // Отправляем подробную отладочную информацию в Telegram
    await sendDebugInfoToTelegram();
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
      {isCardNotSetUp && (
        <>
          <VerifyAccountAlert onClick={handleVerifyClick} />
          <PayoutAlert onClick={handlePayoutClick} />
  
          {/* Test buttons */}
          <button 
            onClick={handleTestData}
            style={{
              margin: '10px',
              padding: '10px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🧪 Test Data
          </button>
          
          <button 
            onClick={debugWebApp}
            style={{
              margin: '10px',
              padding: '10px',
              backgroundColor: '#4ecdc4',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔍 Debug WebApp
          </button>
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