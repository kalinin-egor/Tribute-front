import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import styles from './AddChannelPage.module.css';
import duckImage from '../../../assets/images/misunderstood-duck.png';

const AddChannelPage: React.FC = () => {
  const { webApp } = useTelegram();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/channels');
  };

  const handleSelectChannel = () => {
    // This link opens the native Telegram UI to select a channel to add the bot to.
    // Replace 'tribute' with your actual bot username if it's different.
    const botUsername = process.env.BOT_USERNAME || 'tribute'; // Replace with your bot's username
    const url = `https://t.me/${botUsername}?startgroup=true&admin=post_messages+edit_messages+delete_messages`;
    if (webApp) {
      webApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(handleBackClick);
    }
    
    return () => {
      if (webApp) {
        webApp.BackButton.offClick(handleBackClick);
        webApp.BackButton.hide();
      }
    };
  }, [webApp, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={duckImage} alt="Connect Bot" className={styles.duckImage} />
        <h1 className={styles.title}>Connect bot</h1>
        <p className={styles.description}>
          Add <span className={styles.code}>@tribute</span> as an Admin to your channel and grant permissions.
        </p>
        <a href="https://telegra.ph/Adding-a-Bot-to-a-Channel-as-Admin-05-13" target="_blank" rel="noopener noreferrer" className={styles.link}>
          Open Detailed Instruction
        </a>
      </div>
      <div className={styles.footer}>
        <p className={styles.footerText}>
          The bot won't post or delete anything without your consent.
        </p>
        <button onClick={handleSelectChannel} className={styles.actionButton}>
          Select Channel & Add Bot
        </button>
      </div>
    </div>
  );
};

export default AddChannelPage; 