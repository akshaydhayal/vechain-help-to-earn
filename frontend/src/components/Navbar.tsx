'use client';

import { useWallet } from './ClientOnlyVeChainKit';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AskQuestionModal } from './AskQuestionModal';

interface NavbarProps {
  onAskQuestion?: (title: string, description: string, bounty: string, tags: string[]) => void;
  isTransactionPending?: boolean;
}

export function Navbar({ onAskQuestion, isTransactionPending = false }: NavbarProps) {
  const { account, isConnected, connect, disconnect } = useWallet();
  const router = useRouter();
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);

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

  const handleAskQuestion = (title: string, description: string, bounty: string, tags: string[]) => {
    if (onAskQuestion) {
      onAskQuestion(title, description, bounty, tags);
    }
    setIsAskQuestionOpen(false);
  };

  const handleOpenAskQuestion = () => {
    setIsAskQuestionOpen(true);
  };

  const handleCloseAskQuestion = () => {
    setIsAskQuestionOpen(false);
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

          {/* Wallet Connection and Ask Question */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-cyan-300 font-mono">
                  Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
                <button
                  onClick={handleOpenAskQuestion}
                  className="bg-purple-500 text-white px-3 py-2 rounded border border-purple-400 hover:bg-purple-400 transition-colors text-sm font-bold flex items-center space-x-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Ask Question</span>
                </button>
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
      
      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isAskQuestionOpen}
        onClose={handleCloseAskQuestion}
        onSubmit={handleAskQuestion}
        isTransactionPending={isTransactionPending}
        currentUser={account || ''}
      />
    </header>
  );
}
