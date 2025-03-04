import { jwtDecode } from 'jwt-decode';
import type { ReactNode } from 'react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { verifyToken } from '@api/services/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  // const navigate = useNavigate();

  const getTokens = useCallback(
    () => ({
      accessToken: sessionStorage.getItem('accessToken'),
      refreshToken: sessionStorage.getItem('refreshToken'),
    }),
    [],
  );

  // setAuthData ne touche plus au sessionStorage sauf au login explicite
  const setAuthData = useCallback((accessToken: string | null, refreshToken?: string, fromLogin = false) => {
    console.log('setAuthData called:', { accessToken, refreshToken, fromLogin });
    if (accessToken) {
      try {
        const decoded = jwtDecode<{ id: string; email: string }>(accessToken);
        setUser(decoded);
        setIsAuthenticated(true);
        // Sauvegarde dans sessionStorage uniquement si appelé depuis le login
        if (fromLogin) {
          console.log('Saving tokens from login');
          sessionStorage.setItem('accessToken', accessToken);
          if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        setUser(null);
        setIsAuthenticated(false);
        if (fromLogin) {
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
        }
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      // Pas de clear ici sauf si explicitement demandé depuis login
    }
    setLoading(false);
  }, []);

  const verifyAuth = useCallback(async () => {
    const { accessToken } = getTokens();
    if (!accessToken) {
      console.log('No access token, setting unauthenticated');
      setIsAuthenticated(false);
      setLoading(false);
      // navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode<{ userId: string }>(accessToken);
      console.log('Calling verifyToken with userId:', decoded.userId);
      const verifyResult = await verifyToken(decoded.userId);
      console.log('Verify result:', verifyResult);

      if (verifyResult.success) {
        console.log('Token valid, setting authenticated');
        setAuthData(accessToken); // Pas de fromLogin, donc pas de setItem
      } else {
        console.log('Token invalid, redirecting to login');
        setIsAuthenticated(false);
        setLoading(false);
        // navigate('/login');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setIsAuthenticated(false);
      setLoading(false);
      // navigate('/login');
    }
  }, [getTokens, setAuthData]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, setAuthData }}>{children}</AuthContext.Provider>
  );
};
