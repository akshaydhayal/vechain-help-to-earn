'use client';

import { useState, useEffect } from 'react';

interface ToasterNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
  txHash?: string;
}

export function ToasterNotification({ 
  message, 
  type, 
  duration = 10000, 
  onClose,
  txHash 
}: ToasterNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'error':
        return 'bg-red-500 text-white border-red-600';
      case 'info':
        return 'bg-blue-500 text-white border-blue-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`px-6 py-4 rounded-lg border shadow-lg max-w-md ${getTypeStyles()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getIcon()}</span>
            <div>
              <p className="font-semibold text-sm">{message}</p>
              {type === 'success' && (
                <p className="text-xs opacity-90 mt-1">Transaction confirmed on VeChain</p>
              )}
              {txHash && (
                <a
                  href={`https://explore-testnet.vechain.org/transactions/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline hover:text-gray-200 mt-1 block"
                >
                  View on Explorer →
                </a>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for managing toaster notifications
export function useToaster() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
    txHash?: string;
  }>>([]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number, txHash?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    console.log('🚨 Toaster: Adding notification:', { id, message, type, duration, txHash });
    setNotifications(prev => {
      const newNotifications = [...prev, { id, message, type, duration, txHash }];
      console.log('🚨 Toaster: Updated notifications array:', newNotifications);
      return newNotifications;
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showTransactionSuccess = (txHash: string) => {
    const shortHash = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;
    showNotification(`Transaction confirmed! Hash: ${shortHash}`, 'success', 10000, txHash);
  };

  const showTransactionError = (error: string) => {
    console.log('🚨 Toaster: Showing error notification:', error);
    showNotification(`Transaction failed: ${error}`, 'error', 8000);
  };

  return {
    notifications,
    showNotification,
    removeNotification,
    showTransactionSuccess,
    showTransactionError
  };
}
