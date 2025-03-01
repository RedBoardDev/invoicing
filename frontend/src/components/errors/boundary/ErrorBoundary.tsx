import { ROUTE_PATHS } from '@config/routePaths';
import type React from 'react';
import { Component, type ReactNode } from 'react';
import ErrorPage from './ErrorPage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static logErrorToService(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Logged Error:', { error, errorInfo });
  }

  static handleReload(): void {
    window.location.reload();
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    ErrorBoundary.logErrorToService(error, errorInfo);
  }

  static handleGoHome = (): void => {
    window.location.href = ROUTE_PATHS.private.dashboard;
  };

  override render(): ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <ErrorPage onReload={ErrorBoundary.handleReload} onGoHome={ErrorBoundary.handleGoHome} />;
    }
    return children;
  }
}

export default ErrorBoundary;
