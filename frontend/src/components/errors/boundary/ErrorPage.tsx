import type React from "react";
import { Button } from "antd";
import ErrorBoundaryImage from "@images/illustrations/error_boundary.png";
import Logo from "@images/logo_complet.svg";
import styles from "./ErrorBoundary.module.css";

interface ErrorPageProps {
  onReload: () => void;
  onGoHome: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ onReload, onGoHome }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textSection}>
          <a href="/">
            <img src={Logo} alt="Logo" className={styles.logo} />
          </a>
          <p className={styles.errorCode}>
            <strong>Oops!</strong>
            <br />
            <ins>Something went wrong.</ins>
          </p>
          <p className={styles.errorMessage}>
            An unexpected error occurred in the application. Please try
            refreshing the page or return to the home page.
          </p>
          <div className={styles.buttons}>
            <Button className={styles.primaryButton} onClick={onReload}>
              Refresh Page
            </Button>
            <Button className={styles.secondaryButton} onClick={onGoHome}>
              Go Home
            </Button>
          </div>
        </div>
        <div className={styles.imageSection}>
          <img
            src={ErrorBoundaryImage}
            alt="Error Illustration"
            className={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
