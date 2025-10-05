'use client';

import React, { useState, useEffect } from 'react';
import { contractDataService } from '@/utils/contractDataService';

interface Transaction {
  txId: string;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  type: 'ask_question' | 'submit_answer' | 'upvote' | 'approve' | 'unknown';
  questionId?: number;
  title?: string;
  description?: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading contract transactions...');
      const txData = await contractDataService.getContractTransactions();
      setTransactions(txData);
      
      console.log('Transactions loaded:', txData);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'ask_question':
        return '❓';
      case 'submit_answer':
        return '💬';
      case 'upvote':
        return '👍';
      case 'approve':
        return '✅';
      default:
        return '📄';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'ask_question':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'submit_answer':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'upvote':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'approve':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-3">📊</span>
          Transaction History
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-3">📊</span>
          Transaction History
        </h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">❌</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadTransactions}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">📊</span>
          Transaction History
        </h2>
        <button
          onClick={loadTransactions}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">📄</div>
          <p className="text-gray-600">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <div
              key={tx.txId}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getTransactionColor(tx.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold capitalize">
                        {tx.type.replace('_', ' ')}
                      </span>
                      {tx.questionId && (
                        <span className="text-sm bg-white bg-opacity-50 px-2 py-1 rounded">
                          Question #{tx.questionId}
                        </span>
                      )}
                    </div>
                    
                    {tx.title && (
                      <div className="mb-2">
                        <h3 className="font-medium text-gray-900">{tx.title}</h3>
                        {tx.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {tx.description}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">From:</span> {tx.from}
                      </div>
                      <div>
                        <span className="font-medium">Value:</span> {tx.value} VET
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {formatTime(tx.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <a
                    href={`https://explore-testnet.vechain.org/transactions/${tx.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View on Explorer
                  </a>
                  <div className="text-xs text-gray-500 mt-1">
                    {tx.txId.slice(0, 8)}...{tx.txId.slice(-8)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Transaction Types</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
          <div className="flex items-center">
            <span className="mr-2">❓</span>
            Ask Question (0.1 VET)
          </div>
          <div className="flex items-center">
            <span className="mr-2">💬</span>
            Submit Answer
          </div>
          <div className="flex items-center">
            <span className="mr-2">👍</span>
            Upvote Answer
          </div>
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            Approve Answer
          </div>
        </div>
      </div>
    </div>
  );
}

