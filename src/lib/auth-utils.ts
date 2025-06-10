'use client';

import Cookies from 'js-cookie';
import { clearAllTokens, AUTH_EVENTS, isAuthenticated } from './api/axios-client';

/**
 * Completely clears all authentication state across the application
 * This is the definitive logout function that should be called to ensure
 * consistent state clearing everywhere
 * @param skipEvent If true, won't dispatch the LOGOUT event (to prevent infinite loops)
 */
export function clearAuthState(skipEvent: boolean = false) {
  // Clear all tokens from memory without triggering events
  clearAllTokens();
  
  // Clear authentication cookies
  Cookies.remove('isAuthenticated');
  Cookies.remove('user_id');
  
  // Dispatch logout event for any listeners, but only if not skipped
  if (!skipEvent && typeof window !== 'undefined') {
    // Use setTimeout to break the synchronous call chain and prevent stack overflows
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
    }, 0);
  }
}

/**
 * Checks if the current state indicates the user is authenticated
 * This combines checks from both memory tokens and cookies
 */
export function checkIsFullyAuthenticated() {
  // Check cookie
  const isAuthCookie = Cookies.get('isAuthenticated') === 'true';
  
  // Check in-memory token state
  let isMemoryTokenValid = false;
  
  try {
    isMemoryTokenValid = isAuthenticated();
  } catch (e) {
    console.error('Error checking token auth state:', e);
  }
  
  // Both must be true for us to consider fully authenticated
  return isAuthCookie && isMemoryTokenValid;
} 