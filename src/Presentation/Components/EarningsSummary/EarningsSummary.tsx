import React from 'react';
import styles from './EarningsSummary.module.css';
import { PaymentService, UserService } from '../../../Core';
import { DashboardResponse } from '../../../Domain/types';

interface EarningsSummaryProps {
  dashboardData: DashboardResponse;
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({ dashboardData }) => {
  // Используем Core сервисы для форматирования и получения статуса
  const formattedEarnings = PaymentService.formatPaymentAmount(dashboardData.earn, 'EUR');
  const verificationStatus = UserService.getVerificationStatus(dashboardData);
  
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Your Earnings</span>
        {/* <span className={styles.energy}>⚡️ Energy</span> */}
        {verificationStatus.isVerified && <span className={styles.verified}>✓ Verified</span>}
      </div>
      <div className={styles.earnings}>
        {formattedEarnings}
      </div>
      {verificationStatus.needsVerification && (
        <div className={styles.verificationNotice}>
          Verification required to receive payments
        </div>
      )}
    </div>
  );
};

export default EarningsSummary; 