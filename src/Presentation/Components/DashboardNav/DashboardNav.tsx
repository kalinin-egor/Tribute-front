import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardNav.module.css';

const navItems = [
  { label: 'Payout', icon: '💳', action: 'payout' },
  { label: 'Statistics', icon: '📊', action: 'statistics' },
  { label: 'More', icon: '···', action: 'more' },
];

const DashboardNav: React.FC = () => {
  const navigate = useNavigate();

  const handleStatisticsClick = useCallback(() => {
    // TODO: Implement statistics navigation
  }, []);

  const handleMoreClick = useCallback(() => {
    // TODO: Implement more options
  }, []);

  const handleNavClick = useCallback((action: string) => {
    switch (action) {
      case 'payout':
        navigate('/set-up-payouts');
        break;
      case 'statistics':
        handleStatisticsClick();
        break;
      case 'more':
        handleMoreClick();
        break;
      default:
        break;
    }
  }, [navigate, handleStatisticsClick, handleMoreClick]);

  return (
    <div className={styles.navContainer}>
      {navItems.map((item, index) => (
        <button 
          key={index} 
          className={styles.navButton}
          onClick={() => handleNavClick(item.action)}
        >
          <div className={styles.icon}>{item.icon}</div>
          <div>{item.label}</div>
        </button>
      ))}
    </div>
  );
};

export default DashboardNav; 