'use client';

import { useState, useEffect } from 'react';

interface TransactionStatusProps {
  isPending: boolean;
  lastTransactionHash: string | null;
  onClear: () => void;
}

export function TransactionStatus({ isPending, lastTransactionHash, onClear }: TransactionStatusProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (lastTransactionHash && !isPending) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        onClear();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastTransactionHash, isPending, onClear]);

  if (isPending) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-pulse">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <div>
          <div className="font-semibold">Processing Transaction</div>
          <div className="text-sm opacity-90">Please wait...</div>
        </div>
      </div>
    );
  }

  if (showSuccess && lastTransactionHash) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-bounce">
        <div className="text-2xl">✅</div>
        <div>
          <div className="font-semibold">Transaction Successful!</div>
          <div className="text-sm opacity-90 font-mono">
            {lastTransactionHash.slice(0, 10)}...{lastTransactionHash.slice(-6)}
          </div>
        </div>
        <button
          onClick={() => {
            setShowSuccess(false);
            onClear();
          }}
          className="ml-2 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    );
  }

  return null;
}


