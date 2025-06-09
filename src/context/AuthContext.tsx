'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authApi, AUTH_EVENTS } from '@/lib/api';
import { UserDetails } from '@/types/auth';
import { User } from '@/types/user';
import { toast } from 'react-hot-toast';
import { handleApiError, ApiError } from '@/lib/api/error-handler';
import { getAuthState, isAuthenticated as checkIsAuthenticated } from '@/lib/api/axios-client';
import { clearAuthState, checkIsFullyAuthenticated } from '@/lib/auth-utils';

// Auth context type definition
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  fetchUserProfile: () => Promise<UserDetails | null>;
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
  // Don't set initial auth state from just the cookie - we'll properly initialize in useEffect
  // This prevents a flash of authenticated state that then disappears if tokens aren't valid
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to get initials from name
  const getInitials = (firstName: string, lastName?: string): string => {
    const first = firstName.charAt(0).toUpperCase();
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  };
  
  // Convert API user to our User format
  const mapApiUserToUser = (apiUser: UserDetails): User => {
    // Handle both snake_case and camelCase properties from backend
    const firstName = apiUser.firstName || '';
    const lastName = apiUser.lastName || '';
    const fullName = apiUser.fullName || `${firstName} ${lastName}`.trim();
    
    // Get initials from full name or first and last name
    const initials = fullName 
      ? fullName.split(' ').map(part => part.charAt(0).toUpperCase()).slice(0, 2).join('')
      : getInitials(firstName, lastName);

    return {
      id: apiUser.id,
      name: fullName,
      firstName,
      lastName,
      email: apiUser.email,
      role: apiUser.role,
      status: apiUser.status,
      initials,
      // Add any additional properties we want to expose in the User interface
      profileImage: apiUser.profileImage || null,
      isEmailVerified: apiUser.isEmailVerified || apiUser.is_email_verified || false,
      isPhoneVerified: apiUser.isPhoneVerified || apiUser.is_phone_verified || false,
      lastLoginAt: apiUser.lastLoginAt,
      createdAt: apiUser.createdAt,
      phone: apiUser.phone || null,
      passwordChangeRequired: apiUser.password_change_required || false
    };
  };

  // Function to refresh the session by getting current user details
  const refreshSession = async (): Promise<boolean> => {
    try {
      // Skip if we know we're not authenticated
      if (!checkIsAuthenticated()) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
      
      // Get current user details from the /auth/me endpoint
      const currentUser = await authApi.getCurrentUser();
      
      // Map the API response to our User format
      const mappedUser = mapApiUserToUser(currentUser);
      
      // Update local state
      setUser(mappedUser);
      setIsAuthenticated(true);
      
      // Update cookie for server-side checks
      Cookies.set('isAuthenticated', 'true', { 
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
      });
      
      // Handle password change required flag if present
      if (currentUser.password_change_required) {
        // We could show a notification or redirect to change password page
        // For now, just log it
        console.warn('Password change required for user');
      }
      
      return true;
    } catch (error) {
      console.error('Session refresh failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear cookie
      Cookies.remove('isAuthenticated');
      
      return false;
    }
  };
  
  // Load user session and check token validity on initial load
  useEffect(() => {
    const loadUserSession = async () => {
      try {
        // Check combined auth state from both cookie and localStorage
        const authState = getAuthState();
        const isFullyAuthenticated = checkIsFullyAuthenticated();
        
        // If any auth state is inconsistent, ensure user is logged out completely
        if (!isFullyAuthenticated && authState.accessToken) {
          // We have access token but not properly authenticated - inconsistent state
          console.log('Inconsistent auth state detected, cleaning up...');
          clearAuthState();
          setIsAuthenticated(false);
          setUser(null);
          return;
        }
        
        if (authState.isAuthenticated) {
          // Check if token is close to expiring and refresh it proactively
          if (authState.tokenExpiresIn && authState.tokenExpiresIn < 600) { // Less than 10 minutes remaining
            console.log('Token is about to expire, refreshing proactively');
            await refreshSession();
          } else if (authState.accessToken) {
            await refreshSession();
          }
        } else {
          // Explicitly set not authenticated state
          setIsAuthenticated(false);
          setUser(null);
          
          // Also clear cookie to ensure consistency
          Cookies.remove('isAuthenticated');
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        
        // On error, reset to unauthenticated state
        setIsAuthenticated(false); 
        setUser(null);
        clearAuthState();
      } finally {
        // Always set isLoading to false once we're done
        setIsLoading(false);
      }
    };

    loadUserSession();
    
    // Listen for auth events
    const handleLogin = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.user) {
        const mappedUser = mapApiUserToUser(customEvent.detail.user);
        setUser(mappedUser);
        setIsAuthenticated(true);
      }
    };
    
    const handleLogout = () => {
      // Clear all auth state
      clearAuthState();
      
      // Update component state
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    };
    
    const handleTokenRefresh = async () => {
      // When token is refreshed, we should verify the session is still valid
      console.log('Token refreshed, updating session...');
      await refreshSession();
    };
    
    const handleAuthError = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.message) {
        toast.error(customEvent.detail.message);
      }
    };
    
    window.addEventListener(AUTH_EVENTS.LOGIN, handleLogin);
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    window.addEventListener(AUTH_EVENTS.TOKEN_REFRESH, handleTokenRefresh);
    window.addEventListener(AUTH_EVENTS.AUTH_ERROR, handleAuthError);
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGIN, handleLogin);
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
      window.removeEventListener(AUTH_EVENTS.TOKEN_REFRESH, handleTokenRefresh);
      window.removeEventListener(AUTH_EVENTS.AUTH_ERROR, handleAuthError);
    };
  }, []);

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      
      // Upon successful login, authApi will store tokens and dispatch login event
      // which our useEffect will catch to update the state
      
      // Set persistence duration based on rememberMe
      const tokenOptions = rememberMe 
        ? { expires: 7 } // 7 days
        : undefined;   // Session only
      
      // Additionally, set cookie for server-side auth checks
      Cookies.set('isAuthenticated', 'true', { 
        ...tokenOptions,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
      });
      
      toast.success('Login successful! Welcome back.');
      return true;
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  // Signup function
  const signup = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    try {
      // Call the register API endpoint with combined fullName
      const fullName = `${firstName} ${lastName}`.trim();
      const userDetails = await authApi.register({ 
        email, 
        password, 
        fullName
      });
      
      // Don't automatically log in - return success so the UI can direct to login
      toast.success('Account created successfully! Please log in.');
      return true;
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || 'Registration failed. Please try again.');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Show loading toast during logout
      const loadingToast = toast.loading('Signing out...');
      
      // Call the API to logout
      const response = await authApi.logout();
      
      // Remove loading toast
      toast.dismiss(loadingToast);
      
      // Show success message if everything went well
      if (response.success) {
        toast.success('You have successfully signed out');
      }
      
      // Clear all auth state consistently
      clearAuthState();
      
      // Immediately update local state - don't wait for the event listener
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    } catch (error) {
      // This block should rarely execute since authApi.logout() handles errors internally
      console.error('Logout error in AuthContext:', error);
      
      // Force comprehensive cleanup
      clearAuthState();
      
      // Force local logout state
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  // Fetch user profile function
  const fetchUserProfile = async (): Promise<UserDetails | null> => {
    try {
      // Show loading indicator if desired
      const userDetails = await authApi.getCurrentUser();
      
      // If we have user data, update our local user state as well
      if (userDetails) {
        const mappedUser = mapApiUserToUser(userDetails);
        setUser(mappedUser);
        setIsAuthenticated(true);
      }
      
      return userDetails;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // If the error is unauthorized, clear auth state
      if ((error as any)?.statusCode === 401) {
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove('isAuthenticated');
        
        // Dispatch logout event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
        }
        
        // Toast error message
        toast.error('Your session has expired. Please log in again.');
      }
      
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isLoading,
      login,
      signup,
      logout,
      refreshSession,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
} 