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
    <header className="bg-black border-b-2 border-cyan-400 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center border border-cyan-400">
                <span className="text-black font-bold text-sm font-mono">VQ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-cyan-300 font-mono">VeChain Quora</h1>
                <p className="text-xs text-cyan-400 font-mono">X-to-Earn Q&A Platform</p>
              </div>
            </button>
          </div>


          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-cyan-300 font-mono">
                  Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-500 text-black px-4 py-2 rounded border border-red-400 hover:bg-red-400 transition-colors text-sm font-bold"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-cyan-500 text-black px-4 py-2 rounded border border-cyan-400 hover:bg-cyan-400 transition-colors text-sm font-bold"
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
