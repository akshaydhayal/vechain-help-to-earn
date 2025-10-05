// Real blockchain transaction hook using VeChain Kit
import { useSendTransaction, useWallet, useThor } from '@vechain/vechain-kit';
import { useMemo, useCallback } from 'react';

// Contract ABI for SimpleQA
const SIMPLE_QA_ABI = [
  "function askQuestion(string memory question, uint256 bounty) external payable",
  "function submitAnswer(uint256 questionId, string memory answer) external",
  "function upvoteAnswer(uint256 questionId, uint256 answerId) external",
  "function approveAnswer(uint256 questionId, uint256 answerId) external",
  "function registerUser(string memory username) external",
  "function getPlatformStats() view returns (uint256 totalQuestions, uint256 totalAnswers, uint256 totalUsers)",
  "function getQuestion(uint256 questionId) view returns (address asker, string question, uint256 bounty, bool isResolved, uint256 approvedAnswerId)",
  "function getAnswer(uint256 questionId, uint256 answerId) view returns (address answerer, string answer, uint256 upvotes, bool isApproved)"
];

// Contract configuration
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export function useRealTransaction() {
  const { account } = useWallet();
  const thor = useThor();
  
  const {
    sendTransaction,
    status,
    txReceipt,
    resetStatus,
    isTransactionPending,
    error,
  } = useSendTransaction({
    signerAccountAddress: account?.address ?? '',
  });

  // Build transaction clauses for askQuestion
  const buildAskQuestionClause = useCallback((question: string, bounty: string) => {
    if (!account?.address || !thor) return [];
    
    try {
      const bountyWei = thor.utils.parseEther(bounty);
      
      // Encode the function call
      const iface = new thor.utils.Interface(SIMPLE_QA_ABI);
      const data = iface.encodeFunctionData('askQuestion', [question, bountyWei]);
      
      return [{
        to: CONTRACT_ADDRESS,
        value: bountyWei.toString(),
        data: data,
        comment: `Ask question: "${question}" with ${bounty} VET bounty`,
      }];
    } catch (error) {
      console.error('Error building askQuestion clause:', error);
      return [];
    }
  }, [thor, account?.address]);

  // Build transaction clauses for submitAnswer
  const buildSubmitAnswerClause = useCallback((questionId: number, answer: string) => {
    if (!account?.address || !thor) return [];
    
    try {
      const iface = new thor.utils.Interface(SIMPLE_QA_ABI);
      const data = iface.encodeFunctionData('submitAnswer', [questionId, answer]);
      
      return [{
        to: CONTRACT_ADDRESS,
        value: '0',
        data: data,
        comment: `Submit answer to question ${questionId}`,
      }];
    } catch (error) {
      console.error('Error building submitAnswer clause:', error);
      return [];
    }
  }, [thor, account?.address]);

  // Build transaction clauses for upvoteAnswer
  const buildUpvoteAnswerClause = useCallback((questionId: number, answerId: number) => {
    if (!account?.address || !thor) return [];
    
    try {
      const iface = new thor.utils.Interface(SIMPLE_QA_ABI);
      const data = iface.encodeFunctionData('upvoteAnswer', [questionId, answerId]);
      
      return [{
        to: CONTRACT_ADDRESS,
        value: '0',
        data: data,
        comment: `Upvote answer ${answerId} for question ${questionId}`,
      }];
    } catch (error) {
      console.error('Error building upvoteAnswer clause:', error);
      return [];
    }
  }, [thor, account?.address]);

  // Build transaction clauses for approveAnswer
  const buildApproveAnswerClause = useCallback((questionId: number, answerId: number) => {
    if (!account?.address || !thor) return [];
    
    try {
      const iface = new thor.utils.Interface(SIMPLE_QA_ABI);
      const data = iface.encodeFunctionData('approveAnswer', [questionId, answerId]);
      
      return [{
        to: CONTRACT_ADDRESS,
        value: '0',
        data: data,
        comment: `Approve answer ${answerId} for question ${questionId}`,
      }];
    } catch (error) {
      console.error('Error building approveAnswer clause:', error);
      return [];
    }
  }, [thor, account?.address]);

  // Transaction functions
  const askQuestion = useCallback(async (question: string, bounty: string) => {
    const clauses = buildAskQuestionClause(question, bounty);
    if (clauses.length === 0) {
      throw new Error('Failed to build transaction clauses');
    }
    
    console.log('Sending real transaction with clauses:', clauses);
    const result = await sendTransaction(clauses);
    console.log('Real transaction result:', result);
    return result;
  }, [buildAskQuestionClause, sendTransaction]);

  const submitAnswer = useCallback(async (questionId: number, answer: string) => {
    const clauses = buildSubmitAnswerClause(questionId, answer);
    if (clauses.length === 0) {
      throw new Error('Failed to build transaction clauses');
    }
    
    console.log('Sending real transaction with clauses:', clauses);
    const result = await sendTransaction(clauses);
    console.log('Real transaction result:', result);
    return result;
  }, [buildSubmitAnswerClause, sendTransaction]);

  const upvoteAnswer = useCallback(async (questionId: number, answerId: number) => {
    const clauses = buildUpvoteAnswerClause(questionId, answerId);
    if (clauses.length === 0) {
      throw new Error('Failed to build transaction clauses');
    }
    
    console.log('Sending real transaction with clauses:', clauses);
    const result = await sendTransaction(clauses);
    console.log('Real transaction result:', result);
    return result;
  }, [buildUpvoteAnswerClause, sendTransaction]);

  const approveAnswer = useCallback(async (questionId: number, answerId: number) => {
    const clauses = buildApproveAnswerClause(questionId, answerId);
    if (clauses.length === 0) {
      throw new Error('Failed to build transaction clauses');
    }
    
    console.log('Sending real transaction with clauses:', clauses);
    const result = await sendTransaction(clauses);
    console.log('Real transaction result:', result);
    return result;
  }, [buildApproveAnswerClause, sendTransaction]);

  return {
    // Transaction functions
    askQuestion,
    submitAnswer,
    upvoteAnswer,
    approveAnswer,
    
    // Transaction state
    status,
    txReceipt,
    resetStatus,
    isTransactionPending,
    error,
    
    // Account info
    account: account?.address,
    isConnected: !!account,
  };
}
