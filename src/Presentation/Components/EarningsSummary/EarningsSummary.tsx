import React from 'react';
import styles from './EarningsSummary.module.css';

const EarningsSummary: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Your Earnings</span>
        <span className={styles.energy}>⚡️ Energy</span>
      </div>
      <div className={styles.earnings}>
        €0
      </div>
    </div>
  );
};

export default EarningsSummary; 