'use client';

import { useWallet } from './ClientOnlyVeChainKit';

interface UserProfileProps {
  questionsAsked: number;
  answersProvided: number;
  reputation: number;
}

export function UserProfile({ questionsAsked, answersProvided, reputation }: UserProfileProps) {
  const { account } = useWallet();

  if (!account) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border border-purple-200 p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-3">👤</span>
        Your Profile
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{questionsAsked}</div>
          <div className="text-sm text-gray-600">Questions Asked</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{answersProvided}</div>
          <div className="text-sm text-gray-600">Answers Provided</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{reputation}</div>
          <div className="text-sm text-gray-600">Reputation Points</div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Your Address</div>
        <div className="font-mono text-sm text-gray-800 break-all">
          {account}
        </div>
      </div>
    </div>
  );
}


