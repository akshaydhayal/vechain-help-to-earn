import React from 'react';
import { useRouter } from 'next/navigation';
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

interface QuestionListVariationsProps {
  questions: Question[];
  loading: boolean;
  onUpvoteQuestion?: (questionId: number) => void;
}

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatTimestamp = (timestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// Design 1: Dark Minimalist
export const Design1 = ({ questions, loading, onUpvoteQuestion }: QuestionListVariationsProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="bg-black border-2 border-cyan-400 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 relative z-10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-200 p-4"
        >
          <div 
            className="cursor-pointer"
            onClick={() => router.push(`/question/${question.id}`)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-white flex-1 mr-3">
                {question.title}
              </h3>
              
              {question.bounty && parseFloat(question.bounty) > 0 && (
                <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                  💰 {question.bounty} VET
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-2">
              {question.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {question.tags && question.tags.length > 0 && (
                question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src={getAvatarForAddress(question.asker, 16)} 
                  alt="User avatar" 
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-gray-400 text-xs">
                  {formatAddress(question.asker)} • {formatTimestamp(question.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvoteQuestion?.(question.id);
                  }}
                  className="flex items-center text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="text-sm font-medium">{question.upvotes}</span>
                </button>
                
                {question.hasApprovedAnswer && (
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                    ✅ Resolved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Design 2: Card Stack
export const Design2 = ({ questions, loading, onUpvoteQuestion }: QuestionListVariationsProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="bg-black border-2 border-cyan-400 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 relative z-10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="bg-white rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all duration-200 p-4 relative"
          style={{ transform: `translateX(${index * 2}px)` }}
        >
          <div 
            className="cursor-pointer"
            onClick={() => router.push(`/question/${question.id}`)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-3">
                {question.title}
              </h3>
              
              {question.bounty && parseFloat(question.bounty) > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  💰 {question.bounty} VET
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              {question.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {question.tags && question.tags.length > 0 && (
                question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src={getAvatarForAddress(question.asker, 16)} 
                  alt="User avatar" 
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-gray-500 text-xs">
                  {formatAddress(question.asker)} • {formatTimestamp(question.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvoteQuestion?.(question.id);
                  }}
                  className="flex items-center text-gray-500 hover:text-orange-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="text-sm font-medium">{question.upvotes}</span>
                </button>
                
                {question.hasApprovedAnswer && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    ✅ Resolved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Design 3: Neon Cyberpunk (Reduced spacing)
export const Design3 = ({ questions, loading, onUpvoteQuestion }: QuestionListVariationsProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-black border-2 border-cyan-400 rounded-lg hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 p-4 relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
          
          <div 
            className="cursor-pointer relative z-10"
            onClick={() => router.push(`/question/${question.id}`)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpvoteQuestion?.(question.id);
                }}
                className="flex items-center px-2 py-1 bg-cyan-500 text-black rounded border border-cyan-400 hover:bg-cyan-400 transition-all duration-200 font-bold text-sm"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {question.upvotes}
              </button>
              
              {question.bounty && parseFloat(question.bounty) > 0 && (
                <div className="bg-green-500 text-black px-2 py-1 rounded border border-green-400 font-bold text-xs">
                  💰 {question.bounty} VET
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-cyan-300 mb-2 font-mono">
              {question.title}
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-2 font-mono">
              {question.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {question.tags && question.tags.length > 0 && (
                question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500 text-white text-xs font-mono rounded border border-purple-400"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src={getAvatarForAddress(question.asker, 16)} 
                  alt="User avatar" 
                  className="w-5 h-5 rounded-full border border-cyan-400"
                />
                <span className="text-cyan-300 text-xs font-mono">
                  {formatAddress(question.asker)} • {formatTimestamp(question.timestamp)}
                </span>
              </div>
              
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
};

// Design 4: Compact List
export const Design4 = ({ questions, loading, onUpvoteQuestion }: QuestionListVariationsProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="bg-black border-2 border-cyan-400 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 relative z-10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-gray-800 rounded border border-gray-600 hover:border-gray-500 hover:bg-gray-750 transition-all duration-200 p-3"
        >
          <div 
            className="cursor-pointer"
            onClick={() => router.push(`/question/${question.id}`)}
          >
            {/* Single row layout */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-base font-semibold text-white truncate">
                    {question.title}
                  </h3>
                  
                  {question.bounty && parseFloat(question.bounty) > 0 && (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded flex-shrink-0">
                      💰 {question.bounty} VET
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <img 
                    src={getAvatarForAddress(question.asker, 12)} 
                    alt="User avatar" 
                    className="w-4 h-4 rounded-full"
                  />
                  <span>{formatAddress(question.asker)}</span>
                  <span>•</span>
                  <span>{formatTimestamp(question.timestamp)}</span>
                  
                  {question.tags && question.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex space-x-1">
                        {question.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-1 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {question.tags.length > 2 && (
                          <span className="text-gray-500">+{question.tags.length - 2}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvoteQuestion?.(question.id);
                  }}
                  className="flex items-center text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="text-sm font-medium">{question.upvotes}</span>
                </button>
                
                {question.hasApprovedAnswer && (
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                    ✅
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Design 5: Retro Vintage (Reduced spacing)
export const Design5 = ({ questions, loading, onUpvoteQuestion }: QuestionListVariationsProps) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="bg-black border-2 border-cyan-400 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 relative z-10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg border-2 border-amber-300 hover:border-amber-400 hover:shadow-lg transition-all duration-200 p-4 shadow-md"
        >
          <div 
            className="cursor-pointer"
            onClick={() => router.push(`/question/${question.id}`)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpvoteQuestion?.(question.id);
                }}
                className="flex items-center px-2 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-bold shadow-sm text-sm"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {question.upvotes}
              </button>
              
              {question.bounty && parseFloat(question.bounty) > 0 && (
                <div className="bg-green-600 text-white px-2 py-1 rounded-md font-bold shadow-sm text-xs">
                  💰 {question.bounty} VET
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-serif">
              {question.title}
            </h3>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mb-2">
              {question.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {question.tags && question.tags.length > 0 && (
                question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded-full border border-amber-300"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src={getAvatarForAddress(question.asker, 16)} 
                  alt="User avatar" 
                  className="w-5 h-5 rounded-full border-2 border-amber-400"
                />
                <span className="text-gray-600 text-xs font-medium">
                  {formatAddress(question.asker)} • {formatTimestamp(question.timestamp)}
                </span>
              </div>
              
              {question.hasApprovedAnswer && (
                <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-md">
                  ✅ Resolved
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main component to switch between designs
export const QuestionListVariations = ({ questions, loading, onUpvoteQuestion }: QuestionListVariationsProps) => {
  const [selectedDesign, setSelectedDesign] = React.useState(1);

  const designs = [
    { id: 1, name: "Dark Minimalist", component: Design1 },
    { id: 2, name: "Card Stack", component: Design2 },
    { id: 3, name: "Neon Cyberpunk", component: Design3 },
    { id: 4, name: "Compact List", component: Design4 },
    { id: 5, name: "Retro Vintage", component: Design5 },
  ];

  const SelectedComponent = designs.find(d => d.id === selectedDesign)?.component || Design1;

  return (
    <div>
      {/* Design Selector */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Choose a Design:</h3>
        <div className="flex flex-wrap gap-2">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => setSelectedDesign(design.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedDesign === design.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {design.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Design */}
      <SelectedComponent 
        questions={questions} 
        loading={loading} 
        onUpvoteQuestion={onUpvoteQuestion} 
      />
    </div>
  );
};
