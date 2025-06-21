import React from 'react';
import styles from './PayoutAlert.module.css';

const PayoutAlert: React.FC = () => {
  return (
    <div className={styles.alert}>
      <div className={styles.icon}>⚠️</div>
      <div className={styles.textContainer}>
        <div className={styles.title}>Set Up Payouts</div>
        <div className={styles.subtitle}>Pass verification and provide your details to start receiving payouts.</div>
      </div>
      <div className={styles.arrow}>{'>'}</div>
    </div>
  );
};

export default PayoutAlert; 