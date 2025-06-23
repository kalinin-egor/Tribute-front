import React, { useEffect, useState, useRef } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronRight } from 'react-icons/fa';
import { useTelegram } from '../../hooks/useTelegram';
import tributeApiService from '../../../Data/api';
import { ChannelDTO } from '../../../Domain/types';
import styles from './ChannelsPage.module.css';
import duckImage from '../../../assets/images/misunderstood-duck.png';

const SearchIcon = FaSearch as React.ComponentType<{ className?: string }>;
const ChevronIcon = FaChevronRight as React.ComponentType<{ className?: string }>;

const ChannelsPage: React.FC = () => {
  const { dashboardData, refreshDashboard } = useAppState();
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  const [isAddingBot, setIsAddingBot] = useState(false);
  const checkedChannelsRef = useRef<Set<string>>(new Set());

  const handleSelectChannel = async () => {
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
  };

  // Function to check channel ownership
  const checkChannelOwnership = async (channelId: string) => {
    try {
      console.log('🔍 Checking channel ownership for:', channelId);
      const response = await tributeApiService.checkChannel(channelId);
      console.log('✅ Channel ownership check result:', response);
      
      // Refresh dashboard data to show updated channel status
      await refreshDashboard();
      
      return response;
    } catch (error) {
      console.error('❌ Error checking channel ownership:', error);
      return null;
    }
  };

  // Function to get channel list and check for new unverified channels
  const checkForNewChannels = async () => {
    try {
      console.log('📋 Checking channel list...');
      const channels = await tributeApiService.getChannelList();
      console.log('📋 Current channels:', channels);
      console.log('📋 Number of channels:', channels.length);
      
      // Find channels with is_verified: false that we haven't checked yet
      const unverifiedChannels = channels.filter((channel: ChannelDTO) => {
        const isUnverified = !channel.is_verified;
        const notChecked = !checkedChannelsRef.current.has(channel.id);
        console.log(`Channel ${channel.channel_title}: is_verified=${channel.is_verified}, checked=${checkedChannelsRef.current.has(channel.id)}`);
        return isUnverified && notChecked;
      });
      
      console.log('🔍 Unverified channels found:', unverifiedChannels.length);
      
      if (unverifiedChannels.length > 0) {
        console.log('🆕 Found new unverified channels:', unverifiedChannels);
        
        // Check ownership for each unverified channel
        for (const channel of unverifiedChannels) {
          console.log(`🔍 Checking ownership for channel: ${channel.channel_title} (${channel.id})`);
          
          // Add to checked set to avoid duplicate checks
          checkedChannelsRef.current.add(channel.id);
          
          // Check channel ownership
          await checkChannelOwnership(channel.id);
        }
        
        // If we found and processed new channels, stop the polling
        setIsAddingBot(false);
        console.log('✅ Channel addition process completed');
      } else {
        console.log('📭 No new unverified channels found');
      }
    } catch (error) {
      console.error('❌ Error checking channel list:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  // Track isAddingBot changes
  useEffect(() => {
    console.log('🔄 isAddingBot changed to:', isAddingBot);
  }, [isAddingBot]);

  // Poll for new channels when adding bot
  useEffect(() => {
    if (!isAddingBot) {
      console.log('🛑 Polling stopped - isAddingBot is false');
      return;
    }

    console.log('🔄 Starting channel polling...');
    console.log('📊 Current isAddingBot state:', isAddingBot);
    
    // Check immediately
    checkForNewChannels();

    // Set up interval to check every second
    const interval = setInterval(() => {
      console.log('⏰ Polling tick - checking for new channels...');
      checkForNewChannels();
    }, 1000);

    // Set up timeout to stop polling after 30 seconds
    const timeout = setTimeout(() => {
      if (isAddingBot) {
        console.log('⏰ Timeout reached, stopping channel polling');
        setIsAddingBot(false);
      }
    }, 30000);

    return () => {
      console.log('🧹 Cleaning up polling interval and timeout');
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAddingBot]);

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