import { createContext } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: { id: string; email: string } | null;
}

export interface AuthContextProps extends AuthState {
  setAuthData: (accessToken: string | null, refreshToken?: string, fromLogin?: boolean) => void;
  verifyAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  loading: false,
  user: null,
  setAuthData: () => {},
  verifyAuth: async () => {},
});
