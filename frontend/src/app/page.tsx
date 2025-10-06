'use client';

import { QAInterface } from '@/components/QAInterface';
import { Navbar } from '@/components/Navbar';
import { useWallet } from '@/components/ClientOnlyVeChainKit';

export default function Home() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Common Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {!isConnected ? (
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-white mb-3">
              Welcome to VeChain Quora
            </h2>
            <p className="text-base text-gray-300 mb-6">
              Connect your VeWorld wallet to start asking questions, answering, and earning B3TR rewards
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="text-center p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">❓</span>
                </div>
                <h3 className="text-base font-semibold mb-2 text-white">Ask Questions</h3>
                <p className="text-sm text-gray-300">Post questions with VET bounties and get quality answers from the community.</p>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">💬</span>
                </div>
                <h3 className="text-base font-semibold mb-2 text-white">Answer & Earn</h3>
                <p className="text-sm text-gray-300">Provide helpful answers and earn B3TR tokens through VeBetter DAO rewards.</p>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">⭐</span>
                </div>
                <h3 className="text-base font-semibold mb-2 text-white">Build Reputation</h3>
                <p className="text-sm text-gray-300">Gain reputation points and recognition for quality contributions to the community.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">

                {/* Q&A Interface */}
                <QAInterface />

          </div>
        )}
      </main>
    </div>
  );
}