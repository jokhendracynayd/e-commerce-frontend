'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to manage session ID for anonymous user tracking
 * Generates a new session ID if one doesn't exist, or retrieves existing one
 */
export const useSessionId = (): string => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Check for existing session ID in localStorage
    let existingSessionId = '';
    
    if (typeof window !== 'undefined') {
      existingSessionId = localStorage.getItem('user_session_id') || '';
    }
    
    if (!existingSessionId) {
      // Generate new session ID with timestamp and random string
      const timestamp = Date.now().toString(36);
      const randomString = Math.random().toString(36).substring(2, 15);
      existingSessionId = `sess_${timestamp}_${randomString}`;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_session_id', existingSessionId);
      }
    }

    setSessionId(existingSessionId);
  }, []);

  return sessionId;
};

export default useSessionId; 