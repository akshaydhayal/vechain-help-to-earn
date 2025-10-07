'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWallet } from '@/components/ClientOnlyVeChainKit';
import { vechainContractService } from '@/utils/vechainContractService';
import { vechainSDKTransactionService } from '@/utils/simpleTransactionService';
import { useToaster, ToasterNotification } from '@/components/ToasterNotification';
import { Navbar } from '@/components/Navbar';
import { getAvatarForAddress } from '@/utils/avatarGenerator';

interface Question {
  id: number;
  asker: string;
  title: string;
  description: string;
  bounty: string;
  isActive: boolean;
  hasApprovedAnswer: boolean;
  approvedAnswerId: string;
  upvotes: number;
  tags: string[];
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
      
      // Extract user-friendly error message
      let errorMessage = 'Failed to upvote answer';
      if (err instanceof Error) {
        // Check if it's our custom error message
        if (err.message.includes('Transaction was reverted')) {
          errorMessage = 'Cannot upvote this answer. You may have already upvoted it or are trying to upvote your own answer.';
        } else {
          errorMessage = err.message;
        }
      }
      
      console.log('🚨 Showing error notification:', errorMessage);
      showTransactionError(errorMessage);
    } finally {
      setIsTransactionPending(false);
    }
  };

  const handleApproveAnswer = async (answerId: number) => {
    if (!account) return;

    try {
      setIsTransactionPending(true);
      
      // Debug: Check if answer exists before approving
      console.log('🔍 Attempting to approve answer ID:', answerId);
      console.log('🔍 Available answers:', answers.map(a => ({ id: a.id, content: a.content.slice(0, 50) + '...' })));
      console.log('🔍 Question details:', { 
        asker: question?.asker, 
        bounty: question?.bounty, 
        hasApprovedAnswer: question?.hasApprovedAnswer 
      });
      
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

  const handleUpvoteQuestion = async (questionId: number) => {
    if (!account) return;

    try {
      setIsTransactionPending(true);
      const txHash = await vechainSDKTransactionService.upvoteQuestion(questionId, account);
      showTransactionSuccess(txHash);
      
      // Optimistically update the upvote count immediately
      setQuestion(prevQuestion => 
        prevQuestion ? { ...prevQuestion, upvotes: prevQuestion.upvotes + 1 } : prevQuestion
      );
      
      // Wait for transaction to be confirmed, then refresh data
      setTimeout(async () => {
        console.log('🔄 Reloading question data after upvote...');
        console.log('🔄 Current upvote count before refresh:', question?.upvotes);
        await loadQuestionData();
        console.log('🔄 Question data reloaded');
        
        // Check if the upvote was actually recorded
        if (question) {
          console.log('🔄 Final upvote count after refresh:', question.upvotes);
        }
      }, 15000); // Increased to 15 seconds to ensure transaction is mined
    } catch (err: unknown) {
      console.error('Error upvoting question:', err);
      showTransactionError(err instanceof Error ? err.message : 'Failed to upvote question');
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
      
      {/* Main Content - Reddit-style layout */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Question Post - Reddit-style */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-4">
          {/* Question Header */}
          <div className="flex items-start p-4">
            {/* Voting Section */}
            <div className="flex flex-col items-center mr-4">
              <button 
                onClick={() => handleUpvoteQuestion(question.id)}
                disabled={isTransactionPending}
                className="text-gray-400 hover:text-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Upvote this question"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-gray-300 my-1">{question.upvotes}</span>
            </div>

            {/* Question Content */}
            <div className="flex-1">
              {/* Question Meta */}
              <div className="flex items-center text-xs text-gray-400 mb-2">
                <img 
                  src={getAvatarForAddress(question.asker, 20)} 
                  alt="User avatar" 
                  className="w-5 h-5 rounded-full mr-2"
                />
                <span className="font-medium text-white hover:underline cursor-pointer">
                  {question.asker.slice(0, 6)}...{question.asker.slice(-4)}
                </span>
                <span className="mx-1">•</span>
                <span>{formatTimeAgo(question.timestamp)}</span>
                {question.bounty && parseFloat(question.bounty) > 0 && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="text-green-400 font-semibold">💰 {question.bounty} VET bounty</span>
                  </>
                )}
              </div>

              {/* Question Title */}
              <h1 className="text-xl font-semibold text-white mb-3 leading-tight">
                {question.title}
              </h1>

              {/* Question Description */}
              <div className="text-gray-300 text-sm leading-relaxed mb-4">
                {question.description}
              </div>

              {/* Question Tags */}
              <div className="flex items-center mb-4 flex-wrap gap-2">
                {question.tags && question.tags.length > 0 ? (
                  question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-white">
                    No tags
                  </span>
                )}
                {question.hasApprovedAnswer && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Resolved
                  </span>
                )}
              </div>

              {/* Engagement Bar */}
              <div className="flex items-center space-x-6 text-xs text-gray-400">
                <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span>{answers.length} Answers</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Form - Compact Design */}
        {isConnected && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 mb-4">
            <div className="p-3">
              <div className="flex-1">
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
                  <textarea
                    value={answerContent}
                    onChange={(e) => {
                      setAnswerContent(e.target.value);
                      // Auto-resize textarea
                      const textarea = e.target;
                      textarea.style.height = 'auto';
                      textarea.style.height = Math.max(textarea.scrollHeight, 1 * 20) + 'px'; // 1 line minimum (20px per line)
                    }}
                    placeholder="Write your answer here..."
                    rows={1}
                    style={{ minHeight: '20px' }}
                    className="w-full px-0 py-0 bg-transparent border-0 text-white focus:outline-none resize-none text-sm"
                  />
                  <div className="flex items-center justify-end space-x-2 mt-2 pt-2 border-t border-gray-600">
                    <img 
                      src={getAvatarForAddress(account || '', 16)} 
                      alt="Your avatar" 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                    />
                    <span className="text-xs text-gray-400">
                      Answer as <span className="font-medium text-white">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                    </span>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!answerContent.trim() || isTransactionPending}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                    >
                      {isTransactionPending ? 'Submitting...' : 'Answer'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Answers Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>Sort by:</span>
                <select className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1">
                  <option>Best</option>
                  <option>Top</option>
                  <option>New</option>
                  <option>Old</option>
                </select>
              </div>
            </div>
          </div>
          
          {answers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💭</div>
              <p className="text-gray-400 text-sm">No answers yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {answers.map((answer) => (
                <div key={answer.id} className={`p-4 ${answer.isApproved ? 'bg-green-900/20 border-l-4 border-green-500' : ''}`}>
                  <div className="flex items-start space-x-3">
                    {/* Answer Voting - Left Side */}
                    <div className="flex flex-col items-center">
                      <button 
                        onClick={() => handleUpvoteAnswer(answer.id)}
                        disabled={isTransactionPending}
                        className="text-gray-400 hover:text-orange-400 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span className="text-sm font-semibold text-gray-300 my-1">{answer.upvotes}</span>
                    </div>

                    {/* Answer Content - Right Side */}
                    <div className="flex-1 min-w-0">
                      {/* Approved Answer Banner */}
                      {answer.isApproved && (
                        <div className="mb-3 p-2 bg-green-600/20 border border-green-500/30 rounded-lg">
                          <div className="flex items-center text-green-400 text-xs font-medium">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            This answer has been approved by the question asker
                          </div>
                        </div>
                      )}
                      
                      {/* Answer Meta */}
                      <div className="flex items-center text-xs text-gray-400 mb-2">
                        <img 
                          src={getAvatarForAddress(answer.answerer, 20)} 
                          alt="User avatar" 
                          className="w-5 h-5 rounded-full mr-2"
                        />
                        <span className="font-medium text-white hover:underline cursor-pointer">
                          {answer.answerer.slice(0, 6)}...{answer.answerer.slice(-4)}
                        </span>
                        <span className="mx-1">•</span>
                        <span>{formatTimeAgo(answer.timestamp)}</span>
                        {answer.isApproved && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Approved
                            </span>
                          </>
                        )}
                      </div>

                      {/* Answer Text */}
                      <div className="text-gray-300 text-sm leading-relaxed mb-3">
                        {answer.content}
                      </div>

                      {/* Approve Button - Prominent Display */}
                      {question.asker === account && !answer.isApproved && (
                        <div className="mb-3 p-3 bg-green-600/10 border border-green-500/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-green-400 text-sm">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              This answer looks helpful? Approve it to mark the question as resolved.
                            </div>
                            <button
                              onClick={() => handleApproveAnswer(answer.id)}
                              disabled={isTransactionPending}
                              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {isTransactionPending ? 'Approving...' : 'Approve Answer'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Answer Actions */}
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <button className="hover:text-blue-400 transition-colors">Reply</button>
                        <button className="hover:text-blue-400 transition-colors">Award</button>
                        <button className="hover:text-blue-400 transition-colors">Share</button>
                        <button className="hover:text-blue-400 transition-colors">⋯</button>
                        {question.asker === account && !answer.isApproved && (
                          <button
                            onClick={() => handleApproveAnswer(answer.id)}
                            disabled={isTransactionPending}
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Approve Answer
                          </button>
                        )}
                        {/* Debug info - remove this later */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="text-xs text-gray-500">
                            Debug: asker={question.asker?.slice(0,6)}, account={account?.slice(0,6)}, isApproved={answer.isApproved.toString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
