import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthState } from '../types/auth.types';
import * as authService from '../services/auth.service';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const loadUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      const data = await authService.getProfile();
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        loading: false,
        error: null,
      });
    } catch (err) {
      authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Session expired. Please login again.',
      });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await authService.login({ email, password });
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Login failed',
      }));
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await authService.register({ name, email, password });
      setAuthState({
        isAuthenticated: true,
        user: data.user,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Registration failed',
      }));
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};