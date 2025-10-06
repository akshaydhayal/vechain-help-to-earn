'use client';

import { useWallet } from './ClientOnlyVeChainKit';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { account, isConnected, connect, disconnect } = useWallet();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VQ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">VeChain Quora</h1>
                <p className="text-xs text-gray-400">X-to-Earn Q&A Platform</p>
              </div>
            </button>
          </div>


          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-300">
                  Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
