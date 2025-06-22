import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AddChannelPage.module.css';
import duckImage from '../../../assets/images/misunderstood-duck.png';

const AddChannelPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={duckImage} alt="Connect Bot" className={styles.duckImage} />
        <h1 className={styles.title}>Connect bot</h1>
        <p className={styles.description}>
          Add <span className={styles.code}>@tribute</span> as an Admin to your channel and grant permissions.
        </p>
        <a href="#" className={styles.link}>Open Detailed Instruction</a>
      </div>
      <div className={styles.footer}>
        <p className={styles.footerText}>
          The bot won't post or delete anything without your consent.
        </p>
        <button className={styles.actionButton}>Search Channel</button>
      </div>
    </div>
  );
};

export default AddChannelPage; 