import { createContext, useContext, useState, type ReactNode } from 'react';
import { loginCred } from '../mockData';

type AuthUser = {
  email: string;
  role: 'admin' | 'user';
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
  });

  const login = (email: string, password: string) => {
    if (email === loginCred.email && password === loginCred.password) {
      const nextUser: AuthUser = { email, role: 'admin' };
      setUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
