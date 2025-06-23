import React from 'react';
import styles from './VerifyAccountAlert.module.css';

interface VerifyAccountAlertProps {
  onClick?: () => void;
}

const VerifyAccountAlert: React.FC<VerifyAccountAlertProps> = ({ onClick }) => {
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
          text: `🔍 VerifyAccountAlert: ${message}`,
          parse_mode: 'HTML'
        })
      });
    } catch (error) {
      console.error('Failed to send log to bot:', error);
    }
  };

  const handleClick = async () => {
    await sendLogToBot('🔍 VerifyAccountAlert clicked!');
    console.log('🔍 VerifyAccountAlert clicked!');
    console.log('onClick prop:', onClick);
    await sendLogToBot(`onClick prop: ${!!onClick}`);
    
    if (onClick) {
      await sendLogToBot('✅ Calling onClick handler');
      console.log('✅ Calling onClick handler');
      onClick();
    } else {
      await sendLogToBot('❌ No onClick handler provided');
      console.log('❌ No onClick handler provided');
    }
  };

  return (
    <div className={styles.alert} onClick={handleClick}>
      <div className={styles.icon}>🛡️</div>
      <div className={styles.textContainer}>
        <div className={styles.title}>Verify Account</div>
        <div className={styles.subtitle}>Pass verification to unlock all features and payouts.</div>
      </div>
      <div className={styles.arrow}>{'>'}</div>
    </div>
  );
};

export default VerifyAccountAlert; 