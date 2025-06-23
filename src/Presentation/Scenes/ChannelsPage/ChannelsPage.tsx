import React, { useEffect, useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronRight } from 'react-icons/fa';
import { useTelegram } from '../../hooks/useTelegram';
import tributeApiService from '../../../Data/api';
import styles from './ChannelsPage.module.css';
import duckImage from '../../../assets/images/misunderstood-duck.png';

const SearchIcon = FaSearch as React.ComponentType<{ className?: string }>;
const ChevronIcon = FaChevronRight as React.ComponentType<{ className?: string }>;

const ChannelsPage: React.FC = () => {
  const { dashboardData, refreshDashboard } = useAppState();
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  const [isAddingBot, setIsAddingBot] = useState(false);

  const handleSelectChannel = async () => {
    // Prevent multiple calls while adding bot
    if (isAddingBot) {
      return;
    }

    const botUsername = process.env.BOT_USERNAME || 'tribute_egorbot';
    const url = `https://t.me/${botUsername}?startgroup=true&admin=post_messages+edit_messages+delete_messages`;
    
    setIsAddingBot(true);

    try {
      if (webApp) {
        webApp.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error opening bot link:', error);
      alert('Ошибка при открытии ссылки на бота');
      setIsAddingBot(false);
    }
  };

  // Function to add bot to channel
  const addBotToChannel = async (channelUsername: string) => {
    try {
      const response = await tributeApiService.addBot(channelUsername);
      console.log('Bot added to channel:', response);
      
      // Refresh dashboard data to show the new channel
      await refreshDashboard();
      
      alert('Бот успешно добавлен в канал!');
      setIsAddingBot(false);
    } catch (error) {
      console.error('Error adding bot to channel:', error);
      alert('Ошибка при добавлении бота в канал. Попробуйте еще раз.');
      setIsAddingBot(false);
    }
  };

  // Listen for chat changes when user returns from adding bot
  useEffect(() => {
    if (!webApp) return;

    const checkForChatData = () => {
      if (webApp.initDataUnsafe?.chat && isAddingBot) {
        const chat = webApp.initDataUnsafe.chat;
        console.log('Chat data received:', chat);
        
        // Extract username from chat data
        if (chat.username) {
          addBotToChannel(chat.username);
        } else if (chat.title) {
          // If no username, we might need to handle this differently
          console.log('No username found in chat data, using title:', chat.title);
          // For now, we'll still try to add the bot, but this might need adjustment
          addBotToChannel(chat.title.toLowerCase().replace(/\s+/g, '_'));
        }
      }
    };

    // Check immediately in case data is already available
    checkForChatData();

    // Set up an interval to check for chat data changes
    const interval = setInterval(checkForChatData, 1000);

    // Set up a timeout to reset the adding state if no chat data is received
    const timeout = setTimeout(() => {
      if (isAddingBot) {
        console.log('Timeout reached, resetting adding state');
        setIsAddingBot(false);
      }
    }, 30000); // 30 seconds timeout

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [webApp, isAddingBot]);

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
                <button 
                  onClick={handleSelectChannel} 
                  className={styles.actionButton}
                  disabled={isAddingBot}
                >
                  {isAddingBot ? 'Добавление...' : 'Select Channel & Add Bot'}
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