'use client';

import { useState, useEffect } from 'react';
import { useWallet } from './ClientOnlyVeChainKit';
import { vechainSDKTransactionService } from '@/utils/simpleTransactionService';
import { vechainContractService } from '@/utils/vechainContractService';
import { QuestionList } from './QuestionList';
import { AskQuestionModal } from './AskQuestionModal';
import { useToaster, ToasterNotification } from './ToasterNotification';
// import { B3TRBalanceFull } from './B3TRBalance';

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

interface QAInterfaceProps {
  onAskQuestion?: (title: string, description: string, bounty: string, tags: string[]) => void;
}

// interface Answer { // Unused
//   id: number;
//   questionId: number;
//   answerer: string;
//   content: string;
//   upvotes: number;
//   isApproved: boolean;
//   timestamp: number;
// }

interface PlatformStats {
  totalQuestions: string;
  totalAnswers: string;
  totalUsers: string;
}

export function QAInterface({ onAskQuestion }: QAInterfaceProps = {}) {
  const { account, isConnected } = useWallet();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Transaction states
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  
  
  // Modal state
  const [isAskQuestionModalOpen, setIsAskQuestionModalOpen] = useState(false);
  
  // Toaster notifications
  const { notifications, showTransactionSuccess, showTransactionError, removeNotification, showRewardNotification } = useToaster();

  useEffect(() => {
    if (isConnected && account) {
      console.log('✅ VeChain SDK wallet connected:', account);
      loadPlatformData();
    }
  }, [isConnected, account]);

  const loadPlatformData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading platform data from VeChain contract...');
      
      // Load platform stats from contract
      const platformStats = await vechainContractService.getPlatformStats();
      setStats(platformStats);
      
      // Load questions from contract
      const contractQuestions = await vechainContractService.getAllQuestions();
      setQuestions(contractQuestions);
      
      console.log('Platform data loaded from contract:', {
        stats: platformStats,
        questions: contractQuestions
      });
      
    } catch (err) {
      console.error('Failed to load platform data:', err);
      setError('Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };


  const handleAskQuestion = async (title: string, description: string, bounty: string, tags: string[]) => {
    if (!title.trim() || !description.trim() || !bounty) {
      alert('Please enter a question title, description, and bounty amount');
      return;
    }

    // If onAskQuestion prop is provided, use it instead of the local implementation
    if (onAskQuestion) {
      onAskQuestion(title, description, bounty, tags);
      return;
    }

    try {
      setIsTransactionPending(true);
      setError(null);
      
      console.log('🚀 Sending REAL VeChain testnet transaction via VeChain SDK...');
      console.log('Question Title:', title);
      console.log('Question Description:', description);
      
      // Use VeChain SDK Transaction Service for real blockchain transactions
      // Hardcoded private key will handle transaction signing
      const txHash = await vechainSDKTransactionService.askQuestion(
        title,
        description,
        bounty,
        tags, // Use the tags from the form
        account || undefined
      );
      
      console.log('✅ REAL VeChain testnet transaction sent:', txHash);
      showTransactionSuccess(txHash);
      
      // Reload data after transaction
      setTimeout(() => {
        loadPlatformData();
      }, 2000);
      
    } catch (err) {
      console.error('Failed to ask question:', err);
      setError(`Failed to submit question: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsTransactionPending(false);
    }
  };

  const handleUpvoteQuestion = async (questionId: number) => {
    console.log('🔥 handleUpvoteQuestion called with questionId:', questionId);
    console.log('🔥 Account:', account);
    
    if (!account) {
      console.log('❌ No account found, returning early');
      return;
    }

    try {
      setIsTransactionPending(true);
      setError(null);
      
      console.log('🚀 Sending REAL VeChain testnet transaction for upvoteQuestion via VeChain SDK...');
      console.log('Question ID:', questionId);
      
      const txHash = await vechainSDKTransactionService.upvoteQuestion(questionId, account);
      showTransactionSuccess(txHash);
      
      // Find the question asker's address for reward notification
      const question = questions.find(q => q.id === questionId);
      const questionAsker = question?.asker;
      
      // Show reward notification after transaction success
      setTimeout(() => {
        if (questionAsker) {
          showRewardNotification(questionAsker, "0.05", "question upvote");
        }
      }, 6000); // 6 seconds delay to show after tx notification
      
      // Optimistically update the upvote count immediately
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === questionId 
            ? { ...q, upvotes: q.upvotes + 1 }
            : q
        )
      );
      
      // Wait for transaction to be confirmed, then refresh data
      setTimeout(async () => {
        console.log('🔄 Reloading platform data after upvote...');
        console.log('🔄 Current upvote count before refresh:', questions.find(q => q.id === questionId)?.upvotes);
        await loadPlatformData();
        console.log('🔄 Platform data reloaded');
        
        // Check if the upvote was actually recorded
        const updatedQuestion = questions.find(q => q.id === questionId);
        if (updatedQuestion) {
          console.log('🔄 Final upvote count after refresh:', updatedQuestion.upvotes);
        }
      }, 15000); // Increased to 15 seconds to ensure transaction is mined
      
    } catch (err) {
      console.error('Failed to upvote question:', err);
      showTransactionError(err instanceof Error ? err.message : 'Failed to upvote question');
    } finally {
      setIsTransactionPending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600">
          Please connect your VeWorld wallet to start using the Q&A platform.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-gray-900 min-h-screen">

      {/* Platform Stats */}
      {stats && (
        <div className="bg-gradient-to-r from-amber-900 to-orange-900 border-2 border-amber-400 rounded-lg hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-400/50 transition-all duration-300 p-4 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 animate-pulse"></div>
          <div className="text-center relative z-10">
            <div className="text-sm text-amber-200 font-mono">
              Total Questions: <span className="font-bold text-amber-100">{stats.totalQuestions}</span> • 
              Total Answers: <span className="font-bold text-amber-100">{stats.totalAnswers}</span>
            </div>
            <div className="text-xs text-orange-300 font-mono mt-2">
              🎯 B3TR Rewards: <span className="font-bold text-orange-200">5 B3TR</span> max per question • <span className="font-bold text-orange-200">0.05 B3TR</span> per question upvote (max 10) • <span className="font-bold text-orange-200">0.1 B3TR</span> per answer upvote (max 30)
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-black border-2 border-cyan-400 rounded-lg hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 p-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        {/* <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center relative z-10 font-mono">
          <span className="mr-2">❓</span>
          Community Questions
        </h2> */}
      <div className="relative z-10">
        <QuestionList
          questions={questions}
          loading={loading}
          onUpvoteQuestion={handleUpvoteQuestion}
        />
      </div>
      </div>

      {/* Wallet Details */}
      {/* <div className="bg-black border-2 border-cyan-400 rounded-lg hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 p-4 relative overflow-hidden"> */}
        {/* Animated background */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        <h2 className="text-xl font-bold text-cyan-300 mb-3 relative z-10 font-mono">
          🎉 Wallet Connected Successfully!
        </h2>
        <div className="space-y-2 relative z-10">
          <div>
            <span className="font-medium text-cyan-300 font-mono">Account:</span>
            <span className="ml-2 font-mono text-sm bg-gray-900 text-cyan-300 px-2 py-1 rounded border border-cyan-400">
              {account}
            </span>
          </div>
          <div>
            <span className="font-medium text-cyan-300 font-mono">Connection Type:</span>
            <span className="ml-2 text-sm text-green-400 font-mono">
              VeWorld Wallet
            </span>
          </div>
          <div>
            <span className="font-medium text-cyan-300 font-mono">Network:</span>
            <span className="ml-2 text-sm text-green-400 font-mono">
              VeChain Testnet
            </span>
          </div>
          <div>
            <span className="font-medium text-cyan-300 font-mono">Contract Address:</span>
            <span className="ml-2 font-mono text-xs bg-gray-900 text-cyan-300 px-2 py-1 rounded border border-cyan-400">
              0xab87673a820728a89867bdb5efa0e5aa0ff06a46
            </span>
          </div>
        </div>
      </div> */}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border border-red-600 rounded-lg p-4">
          <div className="text-red-200">{error}</div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-black border-2 border-cyan-400 rounded-lg hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 p-6 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="text-center py-4 relative z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-2 text-cyan-300 font-mono">Loading platform data...</p>
          </div>
        </div>
      )}


      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isAskQuestionModalOpen}
        onClose={() => setIsAskQuestionModalOpen(false)}
        onSubmit={handleAskQuestion}
        isTransactionPending={isTransactionPending}
        currentUser={account || ''}
      />

      {/* Toaster Notifications */}
      {notifications.map((notification) => (
        <ToasterNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          txHash={notification.txHash}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}


