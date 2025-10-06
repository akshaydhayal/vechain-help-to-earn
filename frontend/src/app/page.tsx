'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { QAInterface } from '@/components/QAInterface';
import { useWallet } from '@/components/ClientOnlyVeChainKit';

export default function Home() {
  const { account, isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">VeChain Quora</h1>
              <span className="ml-2 text-sm text-gray-500">X-to-Earn Q&A Platform</span>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to VeChain Quora
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Connect your VeWorld wallet to start asking questions, answering, and earning B3TR rewards
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❓</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Ask Questions</h3>
                <p className="text-gray-600">Post questions with VET bounties and get quality answers from the community.</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Answer & Earn</h3>
                <p className="text-gray-600">Provide helpful answers and earn B3TR tokens through VeBetter DAO rewards.</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Build Reputation</h3>
                <p className="text-gray-600">Gain reputation points and recognition for quality contributions to the community.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
                {/* Connected State */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    🎉 Wallet Connected Successfully!
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700">Account:</span>
                      <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {account}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Connection Type:</span>
                      <span className="ml-2 text-sm text-green-600">
                        VeWorld Wallet
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Network:</span>
                      <span className="ml-2 text-sm text-green-600">
                        VeChain Testnet
                      </span>
                    </div>
                  </div>
                </div>

                {/* Q&A Interface */}
                <QAInterface />

          </div>
        )}
      </main>
    </div>
  );
}