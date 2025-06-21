import React from 'react';
import styles from './CreatorDashboardPage.module.css';
import QuickActions from '../../Components/QuickActions/QuickActions';
import EarningsSummary from '../../Components/EarningsSummary/EarningsSummary';
import DashboardNav from '../../Components/DashboardNav/DashboardNav';
import PayoutAlert from '../../Components/PayoutAlert/PayoutAlert';
import GettingStarted from '../../Components/GettingStarted/GettingStarted';
import MainMenu from '../../Components/MainMenu/MainMenu';
import TransactionsPlaceholder from '../../Components/TransactionsPlaceholder/TransactionsPlaceholder';

const CreatorDashboardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Creator Dashboard</h1>
      <QuickActions />
      <EarningsSummary />
      <DashboardNav />
      <PayoutAlert />
      <GettingStarted />
      <MainMenu />
      <TransactionsPlaceholder />
    </div>
  );
};

export default CreatorDashboardPage; 