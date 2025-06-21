import React from 'react';
import styles from './DashboardNav.module.css';

const navItems = [
  { label: 'Payout', icon: '💳' },
  { label: 'Statistics', icon: '📊' },
  { label: 'More', icon: '···' },
];

const DashboardNav: React.FC = () => {
  return (
    <div className={styles.navContainer}>
      {navItems.map((item, index) => (
        <button key={index} className={styles.navButton}>
          <div className={styles.icon}>{item.icon}</div>
          <div>{item.label}</div>
        </button>
      ))}
    </div>
  );
};

export default DashboardNav; 