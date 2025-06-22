import React from 'react';
import styles from './EarningsSummary.module.css';

interface EarningsSummaryProps {
  earnings: number;
  isVerified: boolean;
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({ earnings, isVerified }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Your Earnings</span>
        {/* <span className={styles.energy}>⚡️ Energy</span> */}
        {isVerified && <span className={styles.verified}>✓ Verified</span>}
      </div>
      <div className={styles.earnings}>
        €{earnings.toFixed(2)}
      </div>
    </div>
  );
};

export default EarningsSummary; 