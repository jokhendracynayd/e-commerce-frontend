'use client';

import { useState, useCallback } from 'react';

interface UseAuthModalReturnType {
  isOpen: boolean;
  message: string;
  action: 'login' | 'signup';
  pendingAction: (() => void) | null;
  openModal: (message?: string, action?: 'login' | 'signup', pendingAction?: () => void) => void;
  closeModal: () => void;
  executeAfterAuth: () => void;
}

/**
 * Hook to manage the authentication modal state
 * 
 * @returns Methods and state for controlling the auth modal
 */
export default function useAuthModal(): UseAuthModalReturnType {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Please log in to continue');
  const [action, setAction] = useState<'login' | 'signup'>('login');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  /**
   * Open the authentication modal
   * 
   * @param message Optional custom message to display
   * @param action Optional action type ('login' or 'signup')
   * @param pendingAction Optional function to execute after successful authentication
   */
  const openModal = useCallback((
    message = 'Please log in to continue',
    action: 'login' | 'signup' = 'login',
    pendingAction: (() => void) | null = null
  ) => {
    setMessage(message);
    setAction(action);
    setIsOpen(true);
    if (pendingAction) {
      setPendingAction(() => pendingAction);
    }
  }, []);

  /**
   * Close the authentication modal
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Execute the pending action (if any) and clear it
   */
  const executeAfterAuth = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  return {
    isOpen,
    message,
    action,
    pendingAction,
    openModal,
    closeModal,
    executeAfterAuth
  };
} 