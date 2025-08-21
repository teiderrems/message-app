import type{ User } from '@/generated/prisma';
import useLocalStorage from '@/hooks/use-local-storage';
import { createContext, useContext, ReactNode } from 'react';


export interface AuthContextType {
  user: Partial<Omit<User,'password'>>;
}

const AuthContext = createContext<AuthContextType>({
  user: {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { getValue } = useLocalStorage();
    const user = getValue("user");
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}