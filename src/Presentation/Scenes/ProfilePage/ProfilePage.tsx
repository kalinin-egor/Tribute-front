import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import styles from './ProfilePage.module.css';
import { ProfilePageProps, ProfileStats, SettingItem } from './ProfilePage.types';

const ProfilePage: React.FC<ProfilePageProps> = () => {
  const { webApp, user, isReady } = useTelegram();
  const navigate = useNavigate();

  useEffect(() => {
    if (webApp && isReady) {
      // Set up back button
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        navigate('/');
      });

      // Hide main button on this page
      webApp.MainButton.hide();

      return () => {
        webApp.BackButton.hide();
      };
    }
  }, [webApp, isReady, navigate]);

  if (!isReady) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  const stats: ProfileStats = {
    totalTributes: 0,
    receivedTributes: 0,
    givenTributes: 0,
    memberSince: 'Today',
  };

  const settings: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM20 5h-6v2h6V5zM4 5h6v2H4V5z" />
        </svg>
      ),
      onClick: handleNotificationsClick,
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      onClick: handlePrivacyClick,
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: handleHelpSupportClick,
    },
  ];

  const handleNotificationsClick = () => {
    // TODO: Implement notifications settings
  };

  const handlePrivacyClick = () => {
    // TODO: Implement privacy settings
  };

  const handleHelpSupportClick = () => {
    // TODO: Implement help and support
  };

  return (
    <div className={`${styles.container} ${styles.animateFadeIn}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          Profile
        </h1>
      </div>

      {/* User Profile */}
      {user && (
        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            {user.photo_url ? (
              <img 
                src={user.photo_url} 
                alt={user.first_name}
                className={styles.userAvatar}
              />
            ) : (
              <div className={styles.userAvatarPlaceholder}>
                <span className={styles.userAvatarInitial}>
                  {user.first_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className={styles.userDetails}>
              <h2>
                {user.first_name} {user.last_name || ''}
              </h2>
              {user.username && (
                <p>@{user.username}</p>
              )}
              {user.language_code && (
                <p className={styles.language}>
                  Language: {user.language_code.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Stats */}
      <div className={styles.profileStats}>
        <h3>Profile Statistics</h3>
        <div className={styles.statsList}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Tributes</span>
            <span className={styles.statValue}>{stats.totalTributes}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Tributes Received</span>
            <span className={`${styles.statValue} ${styles.statValueGreen}`}>
              {stats.receivedTributes}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Tributes Given</span>
            <span className={`${styles.statValue} ${styles.statValuePurple}`}>
              {stats.givenTributes}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Member Since</span>
            <span className={styles.statValue}>{stats.memberSince}</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className={styles.settings}>
        <h3>Settings</h3>
        <div className={styles.settingsList}>
          {settings.map((setting) => (
            <button 
              key={setting.id}
              className={styles.settingButton}
              onClick={setting.onClick}
            >
              <div className={styles.settingContent}>
                <div className={styles.settingLeft}>
                  <setting.icon className={styles.settingIcon} />
                  <span className={styles.settingText}>{setting.title}</span>
                </div>
                <svg className={styles.settingArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className={styles.about}>
        <p>Tribute v1.0.0</p>
        <p>Built for Telegram Mini Apps</p>
      </div>
    </div>
  );
};

export default ProfilePage; 