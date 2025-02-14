import { createContext } from "react";

export interface AuthState {
	isAuthenticated: boolean;
	loading: boolean;
	user: unknown | null;
}

export interface AuthContextProps extends AuthState {
	setAuthData: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextProps>({
	isAuthenticated: false,
	loading: true,
	user: null,
	setAuthData: () => {},
});
