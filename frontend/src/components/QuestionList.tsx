'use client';

import { useRouter } from 'next/navigation';
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
  loading: boolean;
}

export function QuestionList({ questions, loading }: QuestionListProps) {
  const router = useRouter();
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg border border-gray-600 p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🤔</div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No questions yet</h3>
        <p className="text-gray-400">Be the first to ask a question and start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <div
          key={question.id}
          onClick={() => router.push(`/question/${question.id}`)}
          className="bg-gray-800 rounded-lg border border-gray-600 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer p-4"
        >
          {/* Question Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-1 line-clamp-2">
                {question.title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2">
                {question.description}
              </p>
            </div>
            {question.bounty && parseFloat(question.bounty) > 0 && (
              <div className="ml-4 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                  💰 {question.bounty} VET
                </span>
              </div>
            )}
          </div>

          {/* Question Meta */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                <span>Asked by {formatAddress(question.asker)}</span>
              </div>
              <span>•</span>
              <span>{formatTimestamp(question.timestamp)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {question.hasApprovedAnswer && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                  ✅ Resolved
                </span>
              )}
              {question.isActive && !question.hasApprovedAnswer && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
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
