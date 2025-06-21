import React from 'react';
import styles from './TransactionsPlaceholder.module.css';
import duckImage from '../../../assets/images/misunderstood-duck.png';

const TransactionsPlaceholder: React.FC = () => {
  return (
    <div className={styles.placeholder}>
      <img src={duckImage} alt="Misunderstood Duck" className={styles.image} />
      <h3 className={styles.title}>Transactions will appear here</h3>
      <p className={styles.subtitle}>
        Share a subscription or request a donation to get the money flowing.
      </p>
    </div>
  );
};

export default TransactionsPlaceholder; 