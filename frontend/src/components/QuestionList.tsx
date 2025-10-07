'use client';

import { useRouter } from 'next/navigation';
import { formatTimestamp, formatAddress } from '@/utils/timeUtils';
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

interface QuestionListProps {
  questions: Question[];
  loading: boolean;
  onUpvoteQuestion?: (questionId: number) => void;
}

export function QuestionList({ questions, loading, onUpvoteQuestion }: QuestionListProps) {
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
          className="bg-gray-800 rounded-lg border border-gray-600 hover:border-blue-400 hover:shadow-lg transition-all p-4"
        >
          <div className="flex items-start space-x-4">
            {/* Voting Section - Left Side */}
            <div className="flex flex-col items-center space-y-1">
              <button
                onClick={(e) => {
                  console.log('🔥 Upvote button clicked for question:', question.id);
                  e.stopPropagation();
                  onUpvoteQuestion?.(question.id);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-orange-400 transition-colors"
                title="Upvote this question"
              >
                <span className="text-lg">⬆️</span>
              </button>
              <span className="text-sm font-medium text-gray-300">{question.upvotes}</span>
            </div>

            {/* Question Content - Right Side */}
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => router.push(`/question/${question.id}`)}
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
                  
                  {/* Tags */}
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {question.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {question.bounty && parseFloat(question.bounty) > 0 && (
                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                      💰 {question.bounty} VET
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question Meta */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img 
                  src={getAvatarForAddress(question.asker, 16)} 
                  alt="User avatar" 
                  className="w-4 h-4 rounded-full mr-2"
                />
                <span>Asked by {formatAddress(question.asker)}</span>
              </div>
              <span>•</span>
              <span>{formatTimestamp(question.timestamp)}</span>
              {question.upvotes > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center text-orange-400">
                    <span className="mr-1">⬆️</span>
                    {question.upvotes} upvote{question.upvotes !== 1 ? 's' : ''}
                  </span>
                </>
              )}
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
