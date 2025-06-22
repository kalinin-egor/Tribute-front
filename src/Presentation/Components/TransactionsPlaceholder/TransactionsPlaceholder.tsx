import React from 'react';
import { PaymentDTO, SubDTO } from '../../../Domain/types';
import styles from './TransactionsPlaceholder.module.css';
import duckImage from '../../../assets/images/misunderstood-duck.png';

interface TransactionsPlaceholderProps {
  payments: PaymentDTO[];
  subscriptions: SubDTO[];
}

const TransactionsPlaceholder: React.FC<TransactionsPlaceholderProps> = ({ payments, subscriptions }) => {
  if (payments.length === 0 && subscriptions.length === 0) {
    return (
      <div className={styles.placeholder}>
        <img src={duckImage} alt="Misunderstood Duck" className={styles.image} />
        <h3 className={styles.title}>Transactions will appear here</h3>
        <p className={styles.subtitle}>
          Share a subscription or request a donation to get the money flowing.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.transactionsContainer}>
      <h3 className={styles.sectionTitle}>Recent Activity</h3>
      
      {payments.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.subsectionTitle}>Payments ({payments.length})</h4>
          <div className={styles.transactionsList}>
            {payments.map((payment, index) => (
              <div key={index} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <span className={styles.transactionDescription}>{payment.description}</span>
                  <span className={styles.transactionDate}>
                    {new Date(payment.created_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {subscriptions.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.subsectionTitle}>Subscriptions ({subscriptions.length})</h4>
          <div className={styles.transactionsList}>
            {subscriptions.map((subscription, index) => (
              <div key={index} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <span className={styles.transactionDescription}>{subscription.title}</span>
                  <span className={styles.transactionPrice}>€{subscription.price.toFixed(2)}</span>
                </div>
                <p className={styles.transactionSubtitle}>{subscription.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPlaceholder; 