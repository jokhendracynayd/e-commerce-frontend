'use client';

import Cookies from 'js-cookie';
import { clearAllTokens, AUTH_EVENTS } from './api/axios-client';

/**
 * Completely clears all authentication state across the application
 * This is the definitive logout function that should be called to ensure
 * consistent state clearing everywhere
 */
export function clearAuthState() {
  // Clear all tokens from localStorage
  clearAllTokens();
  
  // Clear authentication cookies
  Cookies.remove('isAuthenticated');
  
  // Dispatch logout event for any listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
  }
}

/**
 * Checks if the current state indicates the user is authenticated
 * This combines checks from both localStorage and cookies
 */
export function checkIsFullyAuthenticated() {
  // Check cookie
  const isAuthCookie = Cookies.get('isAuthenticated') === 'true';
  
  // Check localStorage-based state 
  // (we depend on the imported function that checks accessToken and expiry)
  let isLocalStorageAuth = false;
  
  try {
    // This is imported from axios-client but we need to wrap it in try/catch
    // in case it fails when running on the server
    const { isAuthenticated } = require('./api/axios-client');
    isLocalStorageAuth = isAuthenticated();
  } catch (e) {
    console.error('Error checking localStorage auth state:', e);
  }
  
  // Both must be true for us to consider fully authenticated
  return isAuthCookie && isLocalStorageAuth;
} 