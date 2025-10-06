'use client';

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

interface QuestionListProps {
  questions: Question[];
  onQuestionClick: (questionId: number) => void;
  loading: boolean;
}

export function QuestionList({ questions, onQuestionClick, loading }: QuestionListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤔</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions yet</h3>
        <p className="text-gray-500">Be the first to ask a question and start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          onClick={() => onQuestionClick(question.id)}
          className="bg-white rounded-lg border hover:border-blue-300 hover:shadow-md transition-all cursor-pointer p-6"
        >
          {/* Question Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {question.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {question.description}
              </p>
            </div>
            {question.bounty && parseFloat(question.bounty) > 0 && (
              <div className="ml-4 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  💰 {question.bounty} VET
                </span>
              </div>
            )}
          </div>

          {/* Question Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500">
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
                  🔍 Open
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
