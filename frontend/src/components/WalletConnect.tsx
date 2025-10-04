'use client';

import { useWallet, useWalletModal } from '@vechain/vechain-kit';

export function WalletConnect() {
  const { connection, account, disconnect } = useWallet();
  const { open: openWalletModal } = useWalletModal();

  if (connection.isLoading) {
    return (
      <div className="px-4 py-2 bg-gray-100 rounded-lg">
        <span className="text-sm text-gray-600">Connecting...</span>
      </div>
    );
  }

  if (connection.isConnected && account) {
    return (
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 bg-green-100 rounded-lg">
          <span className="text-sm text-green-600">
            Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}
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

  return (
    <button
      onClick={openWalletModal}
      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Connect Wallet
    </button>
  );
}