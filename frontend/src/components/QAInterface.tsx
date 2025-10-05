'use client';

import { useState, useEffect } from 'react';
import { useWallet } from './ClientOnlyVeChainKit';
import { vechainSDKTransactionService } from '@/utils/simpleTransactionService';
import { PrivateKeyInput } from './PrivateKeyInput';

interface Question {
  id: number;
  asker: string;
  question: string;
  bounty: string;
  isResolved: boolean;
  approvedAnswerId: string;
}

interface Answer {
  id: number;
  answerer: string;
  answer: string;
  upvotes: string;
  isApproved: boolean;
}

interface PlatformStats {
  totalQuestions: string;
  totalAnswers: string;
  totalUsers: string;
}

export function QAInterface() {
  const { account, isConnected } = useWallet();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newQuestion, setNewQuestion] = useState('');
  const [questionBounty, setQuestionBounty] = useState('0.1');
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  
  // Transaction states
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);
  
  // Private key input states
  const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<{
    title: string;
    bounty: string;
  } | null>(null);

  useEffect(() => {
    if (isConnected && account) {
      console.log('✅ VeChain SDK wallet connected:', account);
      loadPlatformData();
    }
  }, [isConnected, account]);

  const loadPlatformData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load platform stats (mock for now - will be replaced with real contract calls)
      setStats({
        totalQuestions: '0',
        totalAnswers: '0',
        totalUsers: '0'
      });
      
      // Load questions from mock data
      const mockQuestions = [
        {
          id: 1,
          asker: '0x1234...7890',
          question: 'How do I deploy a smart contract on VeChain?',
          bounty: '1.0',
          isResolved: false,
          approvedAnswerId: '0'
        },
        {
          id: 2,
          asker: '0x2345...8901',
          question: 'What is the difference between VET and VTHO?',
          bounty: '0.5',
          isResolved: true,
          approvedAnswerId: '1'
        }
      ];
      setQuestions(mockQuestions);
      
    } catch (err) {
      console.error('Failed to load platform data:', err);
      setError('Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || !questionBounty) {
      alert('Please enter a question and bounty amount');
      return;
    }

    // Show private key input modal for real transaction
    setPendingTransaction({
      title: newQuestion,
      bounty: questionBounty
    });
    setShowPrivateKeyInput(true);
  };

  const handlePrivateKeySubmit = async (privateKey: string) => {
    if (!pendingTransaction) return;

    try {
      setIsTransactionPending(true);
      setError(null);
      setShowPrivateKeyInput(false);
      
      console.log('🚀 Sending REAL VeChain testnet transaction via VeChain SDK...');
      
      // Use VeChain SDK Transaction Service for real blockchain transactions
      const txHash = await vechainSDKTransactionService.askQuestion(
        pendingTransaction.title, 
        pendingTransaction.bounty, 
        account, 
        privateKey
      );
      
      setLastTransactionHash(txHash);
      console.log('✅ REAL VeChain testnet transaction sent:', txHash);
      alert(`✅ Question submitted to VeChain testnet! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Clear form
      setNewQuestion('');
      setQuestionBounty('0.1');
      setPendingTransaction(null);
      
      // Reload data after transaction
      setTimeout(() => {
        loadPlatformData();
      }, 2000);
      
    } catch (err) {
      console.error('Failed to ask question:', err);
      setError(`Failed to submit question: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsTransactionPending(false);
    }
  };

  const handleSubmitAnswer = async (questionId: number) => {
    if (!newAnswer.trim()) {
      alert('Please enter an answer');
      return;
    }

    try {
      setIsTransactionPending(true);
      setError(null);
      
      console.log('🚀 Sending REAL VeChain testnet transaction for submitAnswer via VeChain SDK...');
      
      const txHash = await vechainSDKTransactionService.submitAnswer(questionId, newAnswer, account);
      setLastTransactionHash(txHash);
      console.log('✅ REAL VeChain testnet transaction sent:', txHash);
      alert(`Answer submitted to VeChain testnet! Transaction: ${txHash.slice(0, 10)}...`);
      setNewAnswer('');
      setSelectedQuestionId(null);
      
      // Reload data after transaction
      setTimeout(() => {
        loadPlatformData();
      }, 2000);
      
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError(`Failed to submit answer: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsTransactionPending(false);
    }
  };

  const handleUpvoteAnswer = async (questionId: number, answerId: number) => {
    try {
      setIsTransactionPending(true);
      setError(null);
      
      console.log('🚀 Sending REAL VeChain testnet transaction for upvoteAnswer via VeChain SDK...');
      
      const txHash = await vechainSDKTransactionService.upvoteAnswer(questionId, answerId, account);
      setLastTransactionHash(txHash);
      console.log('✅ REAL VeChain testnet transaction sent:', txHash);
      alert(`Answer upvoted! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Reload data after transaction
      setTimeout(() => {
        loadPlatformData();
      }, 2000);
      
    } catch (err: any) {
      console.error('Failed to upvote answer:', err);
      setError(`Failed to upvote answer: ${err.message || 'Unknown error'}`);
    } finally {
      setIsTransactionPending(false);
    }
  };

  const handleApproveAnswer = async (questionId: number, answerId: number) => {
    try {
      setIsTransactionPending(true);
      setError(null);
      
      console.log('🚀 Sending REAL VeChain testnet transaction for approveAnswer via VeChain SDK...');
      
      const txHash = await vechainSDKTransactionService.approveAnswer(questionId, answerId, account);
      setLastTransactionHash(txHash);
      console.log('✅ REAL VeChain testnet transaction sent:', txHash);
      alert(`Answer approved! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Reload data after transaction
      setTimeout(() => {
        loadPlatformData();
      }, 2000);
      
    } catch (err: any) {
      console.error('Failed to approve answer:', err);
      setError(`Failed to approve answer: ${err.message || 'Unknown error'}`);
    } finally {
      setIsTransactionPending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600">
          Please connect your VeWorld wallet to start using the Q&A platform.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Private Key Input Modal */}
      <PrivateKeyInput
        isVisible={showPrivateKeyInput}
        onPrivateKeySubmit={handlePrivateKeySubmit}
        onClose={() => {
          setShowPrivateKeyInput(false);
          setPendingTransaction(null);
        }}
      />
      
      {/* Platform Stats */}
      {stats && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{stats.totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{stats.totalAnswers}</div>
              <div className="text-sm text-gray-600">Total Answers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </div>
      )}


      {/* Ask Question Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ask a Question</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="What would you like to know?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bounty (VET)
            </label>
            <input
              type="number"
              value={questionBounty}
              onChange={(e) => setQuestionBounty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.1"
              step="0.01"
              min="0"
            />
          </div>
          <button
            onClick={handleAskQuestion}
            disabled={isTransactionPending}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTransactionPending ? 'Sending to VeChain Testnet...' : '🚀 Ask Question (Real Blockchain)'}
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Questions</h2>
        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No questions yet. Be the first to ask a question!
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{question.question}</h3>
                  <span className="text-sm text-green-600 font-medium">
                    {question.bounty} VET
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Asked by: {question.asker.slice(0, 6)}...{question.asker.slice(-4)}
                </div>
                
                {/* Answer Form */}
                <div className="mb-4">
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Your answer..."
                  />
                  <button
                    onClick={() => handleSubmitAnswer(question.id)}
                    disabled={loading}
                    className="mt-2 bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Transaction Status */}
      {isTransactionPending && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Processing REAL blockchain transaction...</p>
        </div>
      )}

      {/* Last Transaction Hash */}
      {lastTransactionHash && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-800">
            <strong>REAL Transaction Confirmed!</strong>
            <br />
            <span className="text-sm font-mono">Hash: {lastTransactionHash}</span>
          </div>
        </div>
      )}
    </div>
  );
}
