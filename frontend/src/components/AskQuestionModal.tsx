'use client';

import { useState } from 'react';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, bounty: string) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim() && bounty) {
      onSubmit(title, description, bounty);
      setTitle('');
      setDescription('');
      setBounty('0.1');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setBounty('0.1');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-base">?</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Ask a Question</h2>
              <p className="text-xs text-gray-300">Share your question with the community</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {currentUser ? currentUser.slice(2, 4).toUpperCase() : 'A'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-white">
                {currentUser ? `${currentUser.slice(0, 6)}...${currentUser.slice(-4)}` : 'Anonymous'}
              </p>
              <p className="text-xs text-gray-300">VeChain User</p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-300">Visibility:</span>
              <span className="px-1.5 py-0.5 bg-green-900 text-green-200 text-xs font-medium rounded-full">
                Public
              </span>
            </div>
          </div>

          {/* Question Title */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Question Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          {/* Question Description */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Question Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about your question..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              required
            />
          </div>

          {/* Bounty */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Bounty Amount (VET) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={bounty}
                onChange={(e) => setBounty(e.target.value)}
                placeholder="0.1"
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400 text-xs">VET</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Minimum 0.01 VET. Higher bounties attract more attention.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-600">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !description.trim() || !bounty || isTransactionPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isTransactionPending ? 'Submitting...' : 'Ask Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
