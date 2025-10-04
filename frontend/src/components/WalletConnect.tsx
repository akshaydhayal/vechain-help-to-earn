'use client';

import { useWallet } from './ClientOnlyVeChainKit';
import { useState, useEffect } from 'react';

export function WalletConnect() {
  const { account, isConnected, connect, disconnect, isVeWorldAvailable } = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="px-4 py-2 bg-gray-100 rounded-lg">
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 bg-green-100 rounded-lg">
          <span className="text-sm text-green-600">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (!isVeWorldAvailable) {
    return (
      <div className="px-4 py-2 bg-yellow-100 rounded-lg">
        <span className="text-sm text-yellow-600">
          VeWorld wallet not detected
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Connect VeWorld Wallet
    </button>
  );
}