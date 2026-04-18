import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@/types';
import { authService } from '@/services/authService';
import { seedIfNeeded } from '@/services/seed';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    seedIfNeeded();
    setUser(authService.current());
  }, []);

  const login = useCallback((username: string, password: string) => {
    const u = authService.login(username, password);
    if (u) {
      setUser(u);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAdmin: user?.role === 'admin', login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
