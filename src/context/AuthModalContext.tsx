'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useAuthModal from '@/hooks/useAuthModal';
import AuthModal from '@/components/auth/AuthModal';

interface AuthModalContextType {
  isAuthModalOpen: boolean;
  openAuthModal: (message?: string, action?: 'login' | 'signup', pendingAction?: () => void) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function useAuthModalContext() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModalContext must be used within an AuthModalProvider');
  }
  return context;
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const {
    isOpen,
    message,
    action,
    openModal,
    closeModal,
    executeAfterAuth
  } = useAuthModal();

  const handleAuthSuccess = () => {
    executeAfterAuth();
  };

  return (
    <AuthModalContext.Provider
      value={{
        isAuthModalOpen: isOpen,
        openAuthModal: openModal,
        closeAuthModal: closeModal
      }}
    >
      {children}
      <AuthModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={handleAuthSuccess}
        message={message}
        action={action}
      />
    </AuthModalContext.Provider>
  );
} 