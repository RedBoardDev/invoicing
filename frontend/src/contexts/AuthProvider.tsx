import React, { useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<unknown | null>(null);

  const getToken = (): string | null => localStorage.getItem("accessToken");

  const setAuthData = (token: string | null) => {
    if (token) {
      try {
        const decoded: unknown = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = getToken();
      if (!token) {
        setAuthData(null);
        return;
      }
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setAuthData(data.valid ? token : null);
      } catch (error) {
        console.error("Token verification error:", error);
        setAuthData(null);
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, setAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
