import React from 'react';
import styles from './MainMenu.module.css';

const menuItems = [
  { title: 'Channels and Groups', icon: '🗣️' },
  { title: 'Donations', icon: '❤️' },
  { title: 'Goals', icon: '🎯' },
  { title: 'Digital Products', icon: '🛍️' },
  { title: 'Physical Products', icon: '📦' },
  { title: 'Automated Ads', icon: '🤖', new: true },
  { title: 'Affiliate Program', icon: '💲' },
  { title: 'LinkHub', icon: '🔗' },
  { title: 'Managers', icon: '🧑‍💼' },
  { title: 'FAQ', icon: '❓' },
  { title: 'Support', icon: '💬' },
];

const MainMenu: React.FC = () => {
  return (
    <div className={styles.menu}>
      {menuItems.map((item, index) => (
        <div key={index} className={styles.menuItem}>
          <div className={styles.icon}>{item.icon}</div>
          <div className={styles.title}>
            {item.title}
            {item.new && <span className={styles.newBadge}>New</span>}
          </div>
          <div className={styles.arrow}>{'>'}</div>
        </div>
      ))}
    </div>
  );
};

export default MainMenu; 