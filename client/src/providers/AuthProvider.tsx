import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/authService";
import type { User, LoginRequest, RegisterRequest } from "@/types";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signUp: (userData: RegisterRequest) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile.user);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('app_auth_user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("app_auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("app_auth_user");
    }
  }, [user]);

  const signIn = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('access_token', response.access_token);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signUp = async (userData: RegisterRequest) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem('access_token', response.access_token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('app_auth_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile.user);
    } catch (error) {
      signOut();
      throw error;
    }
  };

  const value = useMemo(() => ({ 
    user, 
    isLoading, 
    signIn, 
    signUp, 
    signOut, 
    refreshUser 
  }), [user, isLoading]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
