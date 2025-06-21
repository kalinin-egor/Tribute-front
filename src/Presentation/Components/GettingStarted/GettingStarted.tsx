import React from 'react';
import styles from './GettingStarted.module.css';

const GettingStarted: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <span>0/7</span>
        </div>
      </div>
      <div className={styles.textContainer}>
        <div className={styles.title}>Getting Started</div>
        <div className={styles.subtitle}>Account setup checklist</div>
      </div>
      <div className={styles.arrow}>{'>'}</div>
    </div>
  );
};

export default GettingStarted; 