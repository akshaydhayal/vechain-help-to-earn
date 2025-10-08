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
        return 'bg-black text-green-400 border-2 border-green-400 shadow-2xl shadow-green-400/50';
      case 'error':
        return 'bg-black text-red-400 border-2 border-red-400 shadow-2xl shadow-red-400/50';
      case 'info':
        return 'bg-black text-cyan-400 border-2 border-cyan-400 shadow-2xl shadow-cyan-400/50';
      default:
        return 'bg-black text-gray-400 border-2 border-gray-400 shadow-2xl shadow-gray-400/50';
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
      <div className={`px-4 py-3 rounded-lg border-2 shadow-lg max-w-md relative overflow-hidden ${getTypeStyles()}`}>
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getIcon()}</span>
            <div>
              <p className="font-bold text-sm font-mono">{message}</p>
              {type === 'success' && (
                <p className="text-xs opacity-90 mt-1 font-mono">Transaction confirmed on VeChain</p>
              )}
              {txHash && (
                <a
                  href={`https://explore-testnet.vechain.org/transactions/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline hover:opacity-70 mt-1 block font-mono transition-opacity"
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
            className="ml-4 hover:opacity-70 transition-opacity font-mono"
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
