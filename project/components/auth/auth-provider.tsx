"use client";

import { AuthService, AuthState } from '@/lib/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });

  useEffect(() => {
    // Initialize auth state on mount
    const initAuth = async () => {
      try {
        const user = await AuthService.refreshUser();
        setState({
          user,
          isLoading: false,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'admin' || false,
        });
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await AuthService.login(email, password);
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await AuthService.register(email, password, name);
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await AuthService.logout();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const user = await AuthService.refreshUser();
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || false,
      }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 