'use client';

import { useState } from 'react';

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

interface QuestionCardProps {
  question: Question;
  answers: Answer[];
  onAnswerSubmit: (questionId: number, answer: string) => void;
  onUpvote: (questionId: number, answerId: number) => void;
  onApprove: (questionId: number, answerId: number) => void;
  isTransactionPending: boolean;
  currentUser: string;
}

export function QuestionCard({ 
  question, 
  answers, 
  onAnswerSubmit, 
  onUpvote, 
  onApprove, 
  isTransactionPending,
  currentUser 
}: QuestionCardProps) {
  const [newAnswer, setNewAnswer] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const isAsker = question.asker.toLowerCase() === currentUser.toLowerCase();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Question Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{question.title}</h3>
          <p className="text-gray-600 mb-3">{question.description}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            💰 {question.bounty} VET
          </span>
          {question.hasApprovedAnswer && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              ✅ Resolved
            </span>
          )}
          {!question.isActive && (
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              🔒 Closed
            </span>
          )}
        </div>
      </div>

      {/* Question Meta */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="mr-2">👤</span>
        Asked by: <span className="font-mono ml-1">{formatAddress(question.asker)}</span>
        <span className="mx-2">•</span>
        <span>{formatTimestamp(question.timestamp)}</span>
      </div>

      {/* Answers Section */}
      {answers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            💬 Answers ({answers.length})
          </h4>
          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">👤</span>
                    <span className="font-mono">{formatAddress(answer.answerer)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatTimestamp(answer.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      👍 {answer.upvotes} upvotes
                    </span>
                    {answer.isApproved && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        ✅ Approved
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-800 mb-3">{answer.content}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onUpvote(question.id, answer.id)}
                    disabled={isTransactionPending}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    👍 Upvote
                  </button>
                  {isAsker && !answer.isApproved && (
                    <button
                      onClick={() => onApprove(question.id, answer.id)}
                      disabled={isTransactionPending}
                      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ✅ Approve Answer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answer Form */}
      {question.isActive && (
        <div className="bg-blue-50 rounded-lg p-4">
          {!showAnswerForm ? (
            <button
              onClick={() => setShowAnswerForm(true)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              💬 Submit Answer
            </button>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Answer
              </label>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="Share your knowledge and help the community..."
              />
              <div className="flex space-x-3 mt-3">
                <button
                  onClick={() => onAnswerSubmit(question.id, newAnswer)}
                  disabled={isTransactionPending || !newAnswer.trim()}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isTransactionPending ? 'Submitting...' : '📝 Submit Answer'}
                </button>
                <button
                  onClick={() => {
                    setShowAnswerForm(false);
                    setNewAnswer('');
                  }}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

