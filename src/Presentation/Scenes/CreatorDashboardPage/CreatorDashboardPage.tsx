import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../hooks/useAppState';
import { useTelegram } from '../../hooks/useTelegram';
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
  const { webApp } = useTelegram();
  const navigate = useNavigate();

  // Function to send debug logs to Telegram bot
  const sendLogToBot = async (message: string) => {
    try {
      const botToken = '7688554254:AAETiKY-EFO4VBCXhr-715J28mHEXxoKmvI';
      const chatId = '-4935327333';
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔍 WebApp Debug: ${message}`,
          parse_mode: 'HTML'
        })
      });
    } catch (error) {
      console.error('Failed to send log to bot:', error);
    }
  };

  const handlePayoutClick = () => {
    navigate('/set-up-payouts');
  };

  const handleVerifyClick = async () => {
    await sendLogToBot('🔍 handleVerifyClick called!');
    
    console.log('🔍 handleVerifyClick called!');
    console.log('window.Telegram:', window.Telegram);
    console.log('window.Telegram.WebApp:', window.Telegram?.WebApp);
    console.log('window.Telegram.WebApp.sendData:', window.Telegram?.WebApp?.sendData);
    
    await sendLogToBot(`window.Telegram: ${!!window.Telegram}`);
    await sendLogToBot(`window.Telegram.WebApp: ${!!window.Telegram?.WebApp}`);
    await sendLogToBot(`window.Telegram.WebApp.sendData: ${!!window.Telegram?.WebApp?.sendData}`);
    
    if (window.Telegram && window.Telegram.WebApp) {
      await sendLogToBot('✅ Calling window.Telegram.WebApp.sendData("verify-account")');
      console.log('✅ Calling window.Telegram.WebApp.sendData("verify-account")');
      try {
        window.Telegram.WebApp.sendData('verify-account');
        await sendLogToBot('✅ sendData called successfully');
        console.log('✅ sendData called successfully');
      } catch (error) {
        const errorMsg = `❌ Error calling sendData: ${error}`;
        await sendLogToBot(errorMsg);
        console.error('❌ Error calling sendData:', error);
        alert('Error calling sendData: ' + error);
      }
    } else {
      const errorMsg = '❌ Telegram WebApp not available';
      await sendLogToBot(errorMsg);
      console.log('❌ Telegram WebApp not available');
      alert('Not in Telegram WebApp');
    }
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
          
          {/* Test button for debugging */}
          <button 
            onClick={async () => {
              await sendLogToBot('🧪 Test button clicked');
              console.log('🧪 Test button clicked');
              if (window.Telegram && window.Telegram.WebApp) {
                await sendLogToBot('🧪 Calling sendData from test button');
                console.log('🧪 Calling sendData from test button');
                try {
                  window.Telegram.WebApp.sendData('test-data');
                  await sendLogToBot('🧪 Test sendData called successfully');
                } catch (error) {
                  await sendLogToBot(`🧪 Test sendData error: ${error}`);
                }
              } else {
                await sendLogToBot('🧪 No Telegram WebApp in test button');
                console.log('🧪 No Telegram WebApp in test button');
              }
            }}
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
            🧪 Test SendData
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