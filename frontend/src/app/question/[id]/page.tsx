'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWallet } from '@/components/ClientOnlyVeChainKit';
import { vechainContractService } from '@/utils/vechainContractService';
import { vechainSDKTransactionService } from '@/utils/simpleTransactionService';
import { useToaster, ToasterNotification } from '@/components/ToasterNotification';
import { Navbar } from '@/components/Navbar';

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

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const { account, isConnected } = useWallet();
  const questionId = parseInt(params.id as string);
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  
  // Answer form state
  const [answerContent, setAnswerContent] = useState('');
  
  const { notifications, showTransactionSuccess, showTransactionError, removeNotification } = useToaster();

  const loadQuestionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load question details
      const questionData = await vechainContractService.getQuestion(questionId);
      setQuestion(questionData);

      // Load answers for this question
      const answersData = await vechainContractService.getQuestionAnswers(questionId);
      setAnswers(answersData);

    } catch (err: unknown) {
      console.error('Error loading question data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load question data');
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    if (questionId) {
      loadQuestionData();
    }
  }, [questionId, loadQuestionData]);

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim() || !account) return;

    try {
      setIsTransactionPending(true);
      const txHash = await vechainSDKTransactionService.submitAnswer(
        questionId,
        answerContent,
        account
      );
      
      showTransactionSuccess(txHash);
      setAnswerContent('');
      await loadQuestionData(); // Reload to get the new answer
    } catch (err: unknown) {
      console.error('Error submitting answer:', err);
      showTransactionError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setIsTransactionPending(false);
    }
  };

  const handleUpvoteAnswer = async (answerId: number) => {
    if (!account) return;

    try {
      setIsTransactionPending(true);
      const txHash = await vechainSDKTransactionService.upvoteAnswer(answerId, account);
      showTransactionSuccess(txHash);
      await loadQuestionData(); // Reload to get updated upvote count
    } catch (err: unknown) {
      console.error('Error upvoting answer:', err);
      showTransactionError(err instanceof Error ? err.message : 'Failed to upvote answer');
    } finally {
      setIsTransactionPending(false);
    }
  };

  const handleApproveAnswer = async (answerId: number) => {
    if (!account) return;

    try {
      setIsTransactionPending(true);
      const txHash = await vechainSDKTransactionService.approveAnswer(answerId, account);
      showTransactionSuccess(txHash);
      await loadQuestionData(); // Reload to get updated approval status
    } catch (err: unknown) {
      console.error('Error approving answer:', err);
      showTransactionError(err instanceof Error ? err.message : 'Failed to approve answer');
    } finally {
      setIsTransactionPending(false);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Question Not Found</h2>
          <p className="text-gray-300 mb-6">{error || 'The question you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Common Navbar */}
      <Navbar />
      

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Question Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">{question.title}</h2>
              <p className="text-gray-300 mb-3 text-sm">{question.description}</p>
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <span>Asked by {question.asker.slice(0, 6)}...{question.asker.slice(-4)}</span>
                <span>•</span>
                <span>{formatTimeAgo(question.timestamp)}</span>
                {question.bounty && parseFloat(question.bounty) > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-green-400 font-semibold">💰 {question.bounty} VET bounty</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Answer Form */}
        {isConnected && (
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 p-4 mb-4">
            <h3 className="text-base font-semibold text-white mb-3">Your Answer</h3>
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer here..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3 text-sm"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!answerContent.trim() || isTransactionPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isTransactionPending ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        )}

        {/* Answers */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 p-4">
          <h3 className="text-base font-semibold text-white mb-3">
            Answers ({answers.length})
          </h3>
          
          {answers.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">💭</div>
              <p className="text-gray-300 text-sm">No answers yet. Be the first to answer this question!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {answers.map((answer) => (
                <div key={answer.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {answer.answerer.slice(2, 4).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">
                          {answer.answerer.slice(0, 6)}...{answer.answerer.slice(-4)}
                        </p>
                        <p className="text-xs text-gray-400">{formatTimeAgo(answer.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {answer.isApproved && (
                        <span className="px-1.5 py-0.5 bg-green-900 text-green-200 text-xs font-medium rounded-full">
                          ✓ Approved
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {answer.upvotes} upvotes
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3 text-sm">{answer.content}</p>
                  {isConnected && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpvoteAnswer(answer.id)}
                        disabled={isTransactionPending}
                        className="flex items-center space-x-1 text-xs text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                      >
                        <span>👍</span>
                        <span>Upvote</span>
                      </button>
                      {question.asker === account && !answer.isApproved && (
                        <button
                          onClick={() => handleApproveAnswer(answer.id)}
                          disabled={isTransactionPending}
                          className="flex items-center space-x-1 text-xs text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
                        >
                          <span>✓</span>
                          <span>Approve</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
