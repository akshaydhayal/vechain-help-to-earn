'use client';

import { QAInterface } from '@/components/QAInterface';
import { Navbar } from '@/components/Navbar';
import { useWallet } from '@/components/ClientOnlyVeChainKit';
import { useState } from 'react';
import { vechainSDKTransactionService } from '@/utils/simpleTransactionService';
import { useToaster, ToasterNotification } from '@/components/ToasterNotification';

export default function Home() {
  const { isConnected, account } = useWallet();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const { notifications, showTransactionSuccess, showTransactionError, removeNotification } = useToaster();

  const handleAskQuestion = async (title: string, description: string, bounty: string, tags: string[]) => {
    if (!account) {
      showTransactionError('Please connect your wallet first');
      return;
    }

    try {
      setIsTransactionPending(true);
      const txHash = await vechainSDKTransactionService.askQuestion(
        title,
        description,
        bounty,
        tags,
        account
      );
      showTransactionSuccess(txHash);
      
      // Reload the page to show the new question
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Failed to ask question:', err);
      showTransactionError(err instanceof Error ? err.message : 'Failed to ask question');
    } finally {
      setIsTransactionPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
      {/* Common Navbar */}
      <Navbar onAskQuestion={handleAskQuestion} isTransactionPending={isTransactionPending} />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
        {!isConnected ? (
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-cyan-300 mb-3 font-mono">
              Welcome to VeChain Quora
            </h2>
            <p className="text-base text-cyan-400 mb-6 font-mono">
              Connect your VeWorld wallet to start asking questions, answering, and earning B3TR rewards
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="text-center p-4 bg-black border-2 border-cyan-400 rounded-lg shadow-2xl hover:border-cyan-300 hover:shadow-cyan-400/50 transition-all duration-300 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-cyan-400 relative z-10">
                  <span className="text-xl">❓</span>
                </div>
                <h3 className="text-base font-semibold mb-2 text-cyan-300 font-mono relative z-10">Ask Questions</h3>
                <p className="text-sm text-gray-300 font-mono relative z-10">Post questions with VET bounties and get quality answers from the community.</p>
              </div>
              <div className="text-center p-4 bg-black border-2 border-cyan-400 rounded-lg shadow-2xl hover:border-cyan-300 hover:shadow-cyan-400/50 transition-all duration-300 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-400 relative z-10">
                  <span className="text-xl">💬</span>
                </div>
                <h3 className="text-base font-semibold mb-2 text-cyan-300 font-mono relative z-10">Answer & Earn</h3>
                <p className="text-sm text-gray-300 font-mono relative z-10">Provide helpful answers and earn B3TR tokens through VeBetter DAO rewards.</p>
              </div>
              <div className="text-center p-4 bg-black border-2 border-cyan-400 rounded-lg shadow-2xl hover:border-cyan-300 hover:shadow-cyan-400/50 transition-all duration-300 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-purple-400 relative z-10">
                  <span className="text-xl">⭐</span>
                </div>
                <h3 className="text-base font-semibold mb-2 text-cyan-300 font-mono relative z-10">Build Reputation</h3>
                <p className="text-sm text-gray-300 font-mono relative z-10">Gain reputation points and recognition for quality contributions to the community.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">

                {/* Q&A Interface */}
                <QAInterface onAskQuestion={handleAskQuestion} />

          </div>
        )}
      </main>
      
      {/* Toaster Notifications */}
      {notifications.map((notification) => (
        <ToasterNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          txHash={notification.txHash}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}