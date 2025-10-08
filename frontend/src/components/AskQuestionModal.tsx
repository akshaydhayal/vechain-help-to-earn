'use client';

import { useState } from 'react';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, bounty: string, tags: string[]) => void;
  isTransactionPending: boolean;
  currentUser: string;
}

export function AskQuestionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isTransactionPending,
  currentUser 
}: AskQuestionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bounty, setBounty] = useState('0.1');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit(title, description, '0.1', tags);
      setTitle('');
      setDescription('');
      setBounty('0.1');
      setTags([]);
      setTagInput('');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setBounty('0.1');
    setTags([]);
    setTagInput('');
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-2 border-cyan-400 rounded-xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        {/* Header */}
        <div className="flex items-center justify-between p-2 px-4 border-b border-cyan-400 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center border border-cyan-400">
              <span className="text-black font-semibold text-base font-mono">?</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-cyan-300 font-mono">Ask a Question</h2>
              <p className="text-xs text-cyan-400 font-mono">Share your question with the community</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-cyan-400 hover:text-cyan-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 relative z-10">
          {/* User Info */}
          <div className="flex items-center space-x-2 p-2 bg-gray-900 rounded-lg border border-cyan-400">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center border border-purple-400">
              <span className="text-white font-semibold text-xs font-mono">
                {currentUser ? currentUser.slice(2, 4).toUpperCase() : 'A'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-cyan-300 font-mono">
                {currentUser ? `${currentUser.slice(0, 6)}...${currentUser.slice(-4)}` : 'Anonymous'}
              </p>
              <p className="text-xs text-cyan-400 font-mono">VeChain User</p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-cyan-300 font-mono">Visibility:</span>
              <span className="px-1.5 py-0.5 bg-green-500 text-black text-xs font-medium rounded-full border border-green-400">
                Public
              </span>
            </div>
          </div>

          {/* Question Title */}
          <div>
            <label className="block text-xs font-medium text-cyan-300 mb-1 font-mono">
              Question Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
              className="w-full px-3 py-2 bg-gray-900 border border-cyan-400 text-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm font-mono"
              required
            />
          </div>

          {/* Question Description */}
          <div>
            <label className="block text-xs font-medium text-cyan-300 mb-1 font-mono">
              Question Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about your question..."
              rows={2}
              className="w-full px-3 py-2 bg-gray-900 border border-cyan-400 text-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-sm font-mono"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-cyan-300 mb-1 font-mono">
              Tags (Optional)
            </label>
            <div className="space-y-2">
              {/* Tag Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Add a tag (max 5)"
                  maxLength={20}
                  className="flex-1 px-3 py-2 bg-gray-900 border border-cyan-400 text-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 5 || tags.includes(tagInput.trim())}
                  className="px-3 py-2 bg-cyan-500 text-black rounded border border-cyan-400 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold"
                >
                  Add
                </button>
              </div>
              
              {/* Tags Display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-purple-500 text-white text-xs rounded border border-purple-400 font-mono"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-cyan-400 font-mono">
                Add up to 5 tags to help categorize your question. Press Enter or click Add.
              </p>
            </div>
          </div>


          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-cyan-400">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-cyan-400 hover:text-cyan-200 transition-colors text-sm font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !description.trim() || !bounty || isTransactionPending}
              className="px-4 py-2 bg-cyan-500 text-black rounded border border-cyan-400 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold"
            >
              {isTransactionPending ? 'Submitting...' : 'Ask Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
