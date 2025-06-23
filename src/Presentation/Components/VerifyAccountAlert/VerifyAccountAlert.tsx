import React from 'react';
import styles from './VerifyAccountAlert.module.css';

interface VerifyAccountAlertProps {
  onClick?: () => void;
}

const VerifyAccountAlert: React.FC<VerifyAccountAlertProps> = ({ onClick }) => (
  <div className={styles.alert} onClick={onClick}>
    <div className={styles.icon}>🛡️</div>
    <div className={styles.textContainer}>
      <div className={styles.title}>Verify Account</div>
      <div className={styles.subtitle}>Pass verification to unlock all features and payouts.</div>
    </div>
    <div className={styles.arrow}>{'>'}</div>
  </div>
);

export default VerifyAccountAlert; 