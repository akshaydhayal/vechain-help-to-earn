'use client';

import { useState } from 'react';
import { formatTimestamp, formatAddress } from '@/utils/timeUtils';

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

interface QuestionDetailProps {
  question: Question;
  answers: Answer[];
  onAnswerSubmit: (questionId: number, answer: string) => void;
  onUpvote: (questionId: number, answerId: number) => void;
  onApprove: (questionId: number, answerId: number) => void;
  onBack: () => void;
  isTransactionPending: boolean;
  currentUser: string;
}

export function QuestionDetail({
  question,
  answers,
  onAnswerSubmit,
  onUpvote,
  onApprove,
  onBack,
  isTransactionPending,
  currentUser
}: QuestionDetailProps) {
  const [newAnswer, setNewAnswer] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const handleSubmitAnswer = () => {
    if (newAnswer.trim()) {
      onAnswerSubmit(question.id, newAnswer);
      setNewAnswer('');
      setShowAnswerForm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Questions
      </button>

      {/* Question Card */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {question.title}
            </h1>
            <p className="text-gray-700 leading-relaxed">
              {question.description}
            </p>
          </div>
          {question.bounty && parseFloat(question.bounty) > 0 && (
            <div className="ml-6 flex-shrink-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                💰 {question.bounty} VET Bounty
              </span>
            </div>
          )}
        </div>

        {/* Question Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
              <span>Asked by {formatAddress(question.asker)}</span>
            </div>
            <span>•</span>
            <span>{formatTimestamp(question.timestamp)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {question.hasApprovedAnswer && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Resolved
              </span>
            )}
            {question.isActive && !question.hasApprovedAnswer && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                🔍 Open for Answers
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="mr-2">💬</span>
            Answers ({answers.length})
          </h2>
          {question.isActive && !question.hasApprovedAnswer && (
            <button
              onClick={() => setShowAnswerForm(!showAnswerForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAnswerForm ? 'Cancel' : 'Answer Question'}
            </button>
          )}
        </div>

        {/* Answer Form */}
        {showAnswerForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-3">
              <button
                onClick={() => setShowAnswerForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAnswer}
                disabled={!newAnswer.trim() || isTransactionPending}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTransactionPending ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        )}

        {/* Answers List */}
        {answers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💭</div>
            <p>No answers yet. Be the first to answer this question!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className={`p-4 rounded-lg border ${
                  answer.isApproved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Answer Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {formatAddress(answer.answerer).slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatAddress(answer.answerer)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimestamp(answer.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {answer.isApproved && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Approved
                      </span>
                    )}
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-500">{answer.upvotes}</span>
                      <button
                        onClick={() => onUpvote(question.id, answer.id)}
                        disabled={isTransactionPending}
                        className="text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                      >
                        👍
                      </button>
                    </div>
                  </div>
                </div>

                {/* Answer Content */}
                <div className="text-gray-800 leading-relaxed mb-3">
                  {answer.content}
                </div>

                {/* Answer Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onUpvote(question.id, answer.id)}
                      disabled={isTransactionPending}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                      <span>👍</span>
                      <span>Upvote ({answer.upvotes})</span>
                    </button>
                  </div>
                  
                  {question.asker === currentUser && !question.hasApprovedAnswer && !answer.isApproved && (
                    <button
                      onClick={() => onApprove(question.id, answer.id)}
                      disabled={isTransactionPending}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Approve Answer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
