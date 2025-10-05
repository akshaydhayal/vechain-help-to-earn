'use client';

import { useState, useEffect } from 'react';
import { useWallet } from './ClientOnlyVeChainKit';
import { vechainSDKTransactionService } from '@/utils/simpleTransactionService';
import { contractDataService } from '@/utils/contractDataService';
import { QuestionCard } from './QuestionCard';
import { TransactionHistory } from './TransactionHistory';

interface Question {
  id: number;
  asker: string;
  title: string;
  description: string;
  bounty: string;
  isActive: boolean;
  hasApprovedAnswer: boolean;
  approvedAnswerId: string;
  timestamp: number;
}

interface Answer {
  id: number;
  questionId: number;
  answerer: string;
  content: string;
  upvotes: number;
  isApproved: boolean;
  timestamp: number;
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
  const [answers, setAnswers] = useState<{ [questionId: number]: Answer[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [questionBounty, setQuestionBounty] = useState('0.1');
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  
  // Transaction states
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);

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
      
      console.log('Loading platform data from contract...');
      
      // Load platform stats from contract
      const platformStats = await contractDataService.getPlatformStats();
      setStats(platformStats);
      
      // Load questions from contract
      const contractQuestions = await contractDataService.getAllQuestions();
      setQuestions(contractQuestions);
      
      // Load answers for each question
      const answersData: { [questionId: number]: Answer[] } = {};
      for (const question of contractQuestions) {
        const questionAnswers = await contractDataService.getQuestionAnswers(question.id);
        answersData[question.id] = questionAnswers;
      }
      setAnswers(answersData);
      
      console.log('Platform data loaded:', {
        stats: platformStats,
        questions: contractQuestions,
        answers: answersData
      });
      
    } catch (err) {
      console.error('Failed to load platform data:', err);
      setError('Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!questionTitle.trim() || !questionDescription.trim() || !questionBounty) {
      alert('Please enter a question title, description, and bounty amount');
      return;
    }

    try {
      setIsTransactionPending(true);
      setError(null);
      
      console.log('🚀 Sending REAL VeChain testnet transaction via VeChain SDK...');
      console.log('Question Title:', questionTitle);
      console.log('Question Description:', questionDescription);
      
      // Use VeChain SDK Transaction Service for real blockchain transactions
      // Hardcoded private key will handle transaction signing
          const txHash = await vechainSDKTransactionService.askQuestion(
            questionTitle,
            questionDescription,
            questionBounty, 
            account || undefined
          );
      
      setLastTransactionHash(txHash);
      console.log('✅ REAL VeChain testnet transaction sent:', txHash);
      alert(`✅ Question submitted to VeChain testnet! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Clear form
      setQuestionTitle('');
      setQuestionDescription('');
      setQuestionBounty('0.1');
      
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

  const handleSubmitAnswer = async (questionId: number, answer: string) => {
    if (!answer.trim()) {
      alert('Please enter an answer');
      return;
    }

    try {
      setIsTransactionPending(true);
      setError(null);
      
      console.log('🚀 Sending REAL VeChain testnet transaction for submitAnswer via VeChain SDK...');
      
          const txHash = await vechainSDKTransactionService.submitAnswer(questionId, answer, account || undefined);
      setLastTransactionHash(txHash);
      console.log('✅ REAL VeChain testnet transaction sent:', txHash);
      alert(`Answer submitted to VeChain testnet! Transaction: ${txHash.slice(0, 10)}...`);
      
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
      
          const txHash = await vechainSDKTransactionService.upvoteAnswer(questionId, answerId, account || undefined);
      setLastTransactionHash(txHash);
      console.log('✅ REAL VeChain testnet transaction sent:', txHash);
      alert(`Answer upvoted! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Reload data after transaction
      setTimeout(() => {
        loadPlatformData();
      }, 2000);
      
        } catch (err: unknown) {
          console.error('Failed to upvote answer:', err);
          setError(`Failed to upvote answer: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
          setIsTransactionPending(false);
        }
      };

      const handleApproveAnswer = async (questionId: number, answerId: number) => {
        try {
          setIsTransactionPending(true);
          setError(null);
          
          console.log('🚀 Sending REAL VeChain testnet transaction for approveAnswer via VeChain SDK...');
          
          const txHash = await vechainSDKTransactionService.approveAnswer(questionId, answerId, account || undefined);
          setLastTransactionHash(txHash);
          console.log('✅ REAL VeChain testnet transaction sent:', txHash);
          alert(`Answer approved! Transaction: ${txHash.slice(0, 10)}...`);
          
          // Reload data after transaction
          setTimeout(() => {
            loadPlatformData();
          }, 2000);
          
        } catch (err: unknown) {
          console.error('Failed to approve answer:', err);
          setError(`Failed to approve answer: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
              Question Title
            </label>
            <input
              type="text"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a brief title for your question"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Description
            </label>
            <textarea
              value={questionDescription}
              onChange={(e) => setQuestionDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Provide detailed description of your question..."
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
            disabled={isTransactionPending || !questionTitle.trim() || !questionDescription.trim()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTransactionPending ? 'Sending to VeChain Testnet...' : '🚀 Ask Question (Real Blockchain)'}
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg border border-green-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3">❓</span>
          Community Questions
        </h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading questions from contract...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions yet</h3>
            <p className="text-gray-500">Be the first to ask a question and start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                answers={answers[question.id] || []}
                onAnswerSubmit={handleSubmitAnswer}
                onUpvote={handleUpvoteAnswer}
                onApprove={handleApproveAnswer}
                isTransactionPending={isTransactionPending}
                currentUser={account || ''}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <TransactionHistory />

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
