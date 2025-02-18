import NotFoundImage from '@images/errors/error_404.png';
import type React from 'react';
// import Logo from "@images/logo_complet.svg";
import { useLocation } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textSection}>
          {/* <a href="/">
            <img src={Logo} alt="Logo" className={styles.logo} />
          </a> */}
          <p className={styles.errorCode}>
            <strong>404.</strong> <ins>That&apos;s an error.</ins>
          </p>
          <p className={styles.errorMessage}>
            The requested URL <code>{location.pathname}</code> was not found on this server.
          </p>
          <p className={styles.errorInfo}>
            <ins>That’s all we know.</ins>
          </p>
        </div>
        <div className={styles.imageSection}>
          <img src={NotFoundImage} alt="Page not found" className={styles.image} />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
