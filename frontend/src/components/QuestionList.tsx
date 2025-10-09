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
  replies: number;
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
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-black border-2 border-cyan-400 rounded-lg p-4 animate-pulse relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <div className="h-4 bg-cyan-400/30 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-cyan-400/30 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-cyan-400/30 rounded w-full mb-2"></div>
              <div className="h-3 bg-cyan-400/30 rounded w-2/3"></div>
            </div>
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
    <div className="space-y-2">
      {questions.map((question) => (
      <div
        key={question.id}
        className="bg-black border-2 border-cyan-400 rounded-lg hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 p-2 px-4 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        <div 
          className="cursor-pointer relative z-10"
          onClick={() => router.push(`/question/${question.id}`)}
        >
          {/* Line 1: Title and Description */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-cyan-300 mb-0 font-mono">
                {question.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-0 font-mono">
                {question.description}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="bg-blue-500 text-white px-2 py-1 rounded border border-blue-400 font-bold text-xs">
                🎯 5 B3TR Pool
              </div>
            </div>
          </div>

          {/* Line 2: Tags */}
          <div className="flex items-center mb-1">
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500 text-white text-xs font-mono rounded border border-purple-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Line 3: Upvotes and Author/Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  console.log('🔥 Upvote button clicked for question:', question.id);
                  e.stopPropagation();
                  onUpvoteQuestion?.(question.id);
                }}
                className="flex items-center px-2 py-1 bg-cyan-500 text-black rounded border border-cyan-400 hover:bg-cyan-400 transition-all duration-200 font-bold text-sm"
                title="Upvote this question"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {question.upvotes}
              </button>
              
              <div className="flex items-center text-sm">
                <img 
                  src={getAvatarForAddress(question.asker, 16)} 
                  alt="User avatar" 
                  className="w-5 h-5 rounded-full border border-cyan-400 mr-2"
                />
                <span className="text-cyan-300 font-mono">
                  {formatAddress(question.asker)} • {formatTimestamp(question.timestamp)}
                </span>
              </div>
            </div>
            
            {/* Status Badge - Only show Resolved */}
            {question.hasApprovedAnswer && (
              <span className="px-2 py-1 bg-green-500 text-black text-xs font-bold rounded border border-green-400">
                ✅ RESOLVED
              </span>
            )}
          </div>
        </div>
        </div>
      ))}
    </div>
  );
}
