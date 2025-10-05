'use client';

import { useState } from 'react';

interface PrivateKeyInputProps {
  onPrivateKeySubmit: (privateKey: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export function PrivateKeyInput({ onPrivateKeySubmit, isVisible, onClose }: PrivateKeyInputProps) {
  const [privateKey, setPrivateKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateKey.trim()) {
      alert('Please enter your private key');
      return;
    }

    setIsSubmitting(true);
    try {
      onPrivateKeySubmit(privateKey.trim());
      setPrivateKey('');
    } catch (error) {
      console.error('Failed to submit private key:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🔐 Enter Private Key for Real Transactions
        </h3>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="text-sm text-yellow-800">
            <strong>⚠️ Security Notice:</strong> Your private key is only used locally to sign transactions. 
            It&apos;s never stored or sent to any server. Make sure you&apos;re using a testnet account.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Private Key (without 0x prefix)
            </label>
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your private key..."
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting || !privateKey.trim()}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing...' : '🚀 Sign & Send Real Transaction'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <strong>Note:</strong> This will send a real transaction to VeChain testnet. 
          Make sure you have enough VTHO for gas fees.
        </div>
      </div>
    </div>
  );
}
