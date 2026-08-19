import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastNotification } from '../types';

interface ToastContextValue {
  toasts: ToastNotification[];
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string, duration = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastNotification = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, title?: string) => showToast('success', message, title), [showToast]);
  const error = useCallback((message: string, title?: string) => showToast('error', message, title, 6000), [showToast]);
  const info = useCallback((message: string, title?: string) => showToast('info', message, title), [showToast]);
  const warning = useCallback((message: string, title?: string) => showToast('warning', message, title, 5000), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, info, warning }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
