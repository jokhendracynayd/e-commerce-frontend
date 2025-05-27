'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

// User type definition
export interface User {
  id?: string;
  name: string;
  email: string;
  initials: string;
}

// Auth context type definition
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Load user from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const authStatus = localStorage.getItem('isAuthenticated');
    
    if (savedUser && authStatus === 'true') {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        Cookies.remove('isAuthenticated');
      }
    }
  }, []);

  // Function to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      // In a real app, this would be a call to your authentication API
      // For demo purposes, we'll simulate a successful login
      
      // Generate a fake user (in production, this would come from the backend)
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0], // Just using part of the email as the name for demo
        email: email,
        initials: getInitials(email.split('@')[0]),
      };
      
      // Set auth state
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Save to localStorage if rememberMe is true
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        // Even if not remembering, we need to store the session
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      // Set a cookie for server-side auth checks (middleware)
      Cookies.set('isAuthenticated', 'true', { 
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
      });
      
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be a call to your registration API
      // For demo purposes, we'll just simulate a successful signup
      
      // You would typically not log in the user immediately after signup
      // but might set some state indicating registration was successful
      
      // Generate a fake user (in production, this would come from the backend)
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: name,
        email: email,
        initials: getInitials(name),
      };
      
      // In this demo version, we could automatically log the user in
      // setUser(mockUser);
      // setIsAuthenticated(true);
      // localStorage.setItem('user', JSON.stringify(mockUser));
      // localStorage.setItem('isAuthenticated', 'true');
      // Cookies.set('isAuthenticated', 'true', { 
      //   secure: process.env.NODE_ENV !== 'development',
      //   sameSite: 'strict'
      // });
      
      return true;
    } catch (error) {
      console.error('Signup failed', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    Cookies.remove('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
} 