import { jwtDecode } from 'jwt-decode';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<unknown | null>(null);

  const getToken = useCallback((): string | null => {
    return localStorage.getItem('accessToken');
  }, []);

  const setAuthData = useCallback((token: string | null) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = getToken();
      if (!token) {
        setAuthData(null);
        return;
      }
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setAuthData(data.valid ? token : null);
      } catch (error) {
        console.error('Token verification error:', error);
        setAuthData(null);
      }
    };

    verifyToken();
  }, [getToken, setAuthData]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, setAuthData }}>{children}</AuthContext.Provider>
  );
};
