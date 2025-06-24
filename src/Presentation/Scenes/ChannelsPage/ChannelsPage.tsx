import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { useApi } from '../../hooks/useApi';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronRight } from 'react-icons/fa';
import { useTelegram } from '../../hooks/useTelegram';
import { ChannelDTO } from '../../../Domain/types';
import styles from './ChannelsPage.module.css';
import duckImage from '../../../assets/images/misunderstood-duck.png';

const SearchIcon = FaSearch as React.ComponentType<{ className?: string }>;
const ChevronIcon = FaChevronRight as React.ComponentType<{ className?: string }>;

const ChannelsPage: React.FC = () => {
  const { dashboardData, refreshDashboard } = useAppState();
  const { getChannelList, checkChannel } = useApi();
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  const [isAddingBot, setIsAddingBot] = useState(false);
  const checkedChannelsRef = useRef<Set<string>>(new Set());

  const handleSelectChannel = useCallback(async () => {
    // Prevent multiple calls while adding bot
    if (isAddingBot) {
      console.log('🚫 Already adding bot, ignoring click');
      return;
    }

    const botUsername = process.env.BOT_USERNAME || 'tribute_egorbot';
    const url = `https://t.me/${botUsername}?startgroup=true&admin=post_messages+edit_messages+delete_messages&start=add_channel`;
    
    console.log('🎯 Setting isAddingBot to true');
    setIsAddingBot(true);
    console.log('🔗 Opening bot link with URL:', url);

    try {
      if (webApp) {
        webApp.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('❌ Error opening bot link:', error);
      alert('Ошибка при открытии ссылки на бота');
      setIsAddingBot(false);
    }
  }, [isAddingBot, webApp]);

  const handleAddBotClick = useCallback(async () => {
    if (isAddingBot) {
      return;
    }

    setIsAddingBot(true);
    
    const url = `https://t.me/TributeBot?start=add_bot`;
    window.open(url, '_blank');
  }, [isAddingBot]);

  const checkChannelOwnership = useCallback(async (channelId: string) => {
    try {
      const response = await checkChannel(channelId);
      return response;
    } catch (error) {
      console.error('Error checking channel ownership:', error);
      return null;
    }
  }, [checkChannel]);

  const processNewChannels = useCallback(async () => {
    try {
      const channels = await getChannelList();
      
      // Находим непроверенные каналы
      const unverifiedChannels = channels.filter(channel => !channel.is_verified);
      
      if (unverifiedChannels.length > 0) {
        // Проверяем каждый непроверенный канал
        for (const channel of unverifiedChannels) {
          if (!checkedChannelsRef.current.has(channel.id)) {
            const response = await checkChannelOwnership(channel.id);
            if (response) {
              checkedChannelsRef.current.add(channel.id);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing new channels:', error);
    }
  }, [getChannelList, checkChannelOwnership]);

  // Эффект для опроса каналов
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    if (isAddingBot) {
      // Опрашиваем каждые 2 секунды
      intervalId = setInterval(() => {
        processNewChannels();
      }, 2000);

      // Останавливаем опрос через 30 секунд
      timeoutId = setTimeout(() => {
        setIsAddingBot(false);
      }, 30000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAddingBot, processNewChannels]);

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