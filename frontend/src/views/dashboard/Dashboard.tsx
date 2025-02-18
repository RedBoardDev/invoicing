import type React from 'react';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className={styles.title}>Welcome to Your Frontend Template</h1>
      <p className={styles.subtitle}>A scalable and modular starter for building modern React applications.</p>
    </div>
  );
};

export default Dashboard;
