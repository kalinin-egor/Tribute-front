import React, { useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronRight } from 'react-icons/fa';
import { useTelegram } from '../../hooks/useTelegram';
import styles from './ChannelsPage.module.css';
import duckImage from '../../../assets/images/misunderstood-duck.png';

const SearchIcon = FaSearch as React.ComponentType<{ className?: string }>;
const ChevronIcon = FaChevronRight as React.ComponentType<{ className?: string }>;

const ChannelsPage: React.FC = () => {
  const { dashboardData } = useAppState();
  const { webApp } = useTelegram();
  const navigate = useNavigate();

  const handleSelectChannel = () => {
    const botUsername = process.env.BOT_USERNAME || 'tribute';
    const url = `https://t.me/${botUsername}?startgroup=true&admin=post_messages+edit_messages+delete_messages`;
    if (webApp) {
      webApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };
  
  // Show back button on mount and hide on unmount
  useEffect(() => {
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => navigate('/dashboard'));
    }
    return () => {
      if (webApp) {
        webApp.BackButton.offClick(() => navigate('/dashboard'));
        webApp.BackButton.hide();
      }
    };
  }, [webApp, navigate]);
  
  if (!dashboardData) {
      return <div>Loading...</div>; // Or a proper spinner
  }

  // If no channels, show the "add bot" page (duck page)
  if (dashboardData['channels-and-groups'].length === 0) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <img src={duckImage} alt="Connect Bot" className={styles.duckImage} />
                <h1 className={styles.title}>Connect bot</h1>
                <p className={styles.description}>
                Add <span className={styles.code}>@tribute_egorbot</span> as an Admin to your channel and grant permissions.
                </p>
                <a href="https://telegra.ph/Adding-a-Bot-to-a-Channel-as-Admin-05-13" target="_blank" rel="noopener noreferrer" className={styles.link}>
                Open Detailed Instruction
                </a>
                <p className={styles.footerText}>
                The bot won't post or delete anything without your consent.
                </p>
            </div>
            <div className={styles.footer}>
                <button onClick={handleSelectChannel} className={styles.actionButton}>
                Select Channel & Add Bot
                </button>
            </div>
        </div>
    );
  }

  // If there are channels, show the list
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Channels and Groups</h1>
        <div className={styles.searchContainer}>
          <SearchIcon className={styles.searchIcon} />
          <input type="text" placeholder="Search" className={styles.searchInput} />
        </div>
      </div>
      
      <ul className={styles.channelList}>
        {dashboardData['channels-and-groups'].map(channel => (
          <li key={channel.id} className={styles.channelItem}>
            <div className={styles.channelInfo}>
              <span className={styles.channelName}>{channel.channel_username}</span>
              <span className={styles.subscriberCount}>0 paid subscribers</span>
            </div>
            <ChevronIcon className={styles.arrow} />
          </li>
        ))}
      </ul>
      
      <div className={styles.footer}>
         <button onClick={handleSelectChannel} className={styles.actionButton}>
            Add another channel
        </button>
      </div>
    </div>
  );
};

export default ChannelsPage; 