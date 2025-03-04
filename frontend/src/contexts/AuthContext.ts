// frontend/src/contexts/AuthContext.ts
import { createContext } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: unknown | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthContextProps extends AuthState {
  setAuthData: (accessToken: string | null, refreshToken: string | null, fromLogin: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  loading: true,
  user: null,
  accessToken: null,
  refreshToken: null,
  setAuthData: () => {},
  logout: () => {},
});
