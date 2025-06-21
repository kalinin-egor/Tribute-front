import React from 'react';
import styles from './QuickActions.module.css';

const actions = [
  { title: 'Add a manager to your channel', icon: '🧑‍💼' },
  { title: 'Physical products guide', icon: '📖' },
  { title: 'How to create a referral offer', icon: '🤝' },
  { title: 'How to create a fundraising goal', icon: '🎯' },
];

const QuickActions: React.FC = () => {
  return (
    <div className={styles.quickActions}>
      {actions.map((action, index) => (
        <div key={index} className={styles.actionCard}>
          <div className={styles.icon}>{action.icon}</div>
          <p>{action.title}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickActions; 