import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import styles from './HomePage.module.css';
import { HomePageProps, UserStats, QuickAction } from './HomePage.types';

const HomePage: React.FC<HomePageProps> = () => {
  const { webApp, user, isReady } = useTelegram();
  const navigate = useNavigate();

  useEffect(() => {
    if (webApp && isReady) {
      // Set up main button
      webApp.MainButton.setText('View Profile');
      webApp.MainButton.show();
      webApp.MainButton.onClick(() => {
        navigate('/profile');
      });

      return () => {
        webApp.MainButton.hide();
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

  const stats: UserStats = {
    totalTributes: 0,
    receivedTributes: 0,
    givenTributes: 0,
  };

  const handleNewTributeClick = () => {
    // TODO: Implement new tribute functionality
  };

  const quickActions: QuickAction[] = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'View your profile',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => navigate('/dashboard'),
      iconColor: 'primary',
    },
    {
      id: 'new-tribute',
      title: 'New Tribute',
      description: 'Create a tribute',
      icon: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      onClick: handleNewTributeClick,
      iconColor: 'green',
    },
  ];

  return (
    <div className={`${styles.container} ${styles.animateFadeIn}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          Tribute
        </h1>
        <p className={styles.subtitle}>
          Welcome to your personal tribute collection
        </p>
      </div>

      {/* User Welcome */}
      {user && (
        <div className={styles.userWelcome}>
          <div className={styles.userInfo}>
            {user.photo_url && (
              <img 
                src={user.photo_url} 
                alt={user.first_name}
                className={styles.userAvatar}
              />
            )}
            <div className={styles.userDetails}>
              <h2>
                Hello, {user.first_name}!
              </h2>
              <p>
                {user.username ? `@${user.username}` : 'Welcome to Tribute'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <button 
              key={action.id}
              onClick={action.onClick}
              className={styles.actionButton}
            >
              <div className={`${styles.actionIcon} ${
                action.iconColor === 'primary' ? styles.actionIconPrimary : styles.actionIconGreen
              }`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h4 className={styles.actionTitle}>{action.title}</h4>
              <p className={styles.actionDescription}>{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsCard}>
        <h3 className={styles.statsTitle}>Your Stats</h3>
        <div className={styles.statsGrid}>
          <div>
            <div className={`${styles.statValue} ${styles.statValuePrimary}`}>
              {stats.totalTributes}
            </div>
            <div className={styles.statLabel}>Tributes</div>
          </div>
          <div>
            <div className={`${styles.statValue} ${styles.statValueGreen}`}>
              {stats.receivedTributes}
            </div>
            <div className={styles.statLabel}>Received</div>
          </div>
          <div>
            <div className={`${styles.statValue} ${styles.statValuePurple}`}>
              {stats.givenTributes}
            </div>
            <div className={styles.statLabel}>Given</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 