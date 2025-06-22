import React from 'react';
import { useAppState } from '../../hooks/useAppState';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronRight } from 'react-icons/fa';
import styles from './ChannelsPage.module.css';

const SearchIcon = FaSearch as React.ComponentType<{ className?: string }>;
const ChevronIcon = FaChevronRight as React.ComponentType<{ className?: string }>;

const ChannelsPage: React.FC = () => {
  const { dashboardData } = useAppState();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Channels and Groups</h1>
        <div className={styles.searchContainer}>
          <SearchIcon className={styles.searchIcon} />
          <input type="text" placeholder="Search" className={styles.searchInput} />
        </div>
      </div>
      
      {dashboardData && dashboardData['channels-and-groups'].length > 0 ? (
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
      ) : (
        <div className={styles.noChannels}>
          <p>No channels connected yet.</p>
        </div>
      )}
      
      <div className={styles.footer}>
        <Link to="/channels/add" className={styles.addButton}>Add</Link>
      </div>
    </div>
  );
};

export default ChannelsPage; 