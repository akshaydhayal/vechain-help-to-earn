// VeChain-specific transaction service using VeChain SDK
import { Transaction } from '@vechain/sdk-core';
import { thor } from '@vechain/sdk-network';

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

export class VeChainTransactionService {
  private contractAddress: string;
  private isConnected: boolean = false;
  private currentAccount: string | null = null;

  constructor() {
    this.contractAddress = CONTRACT_ADDRESS;
    console.log('VeChain transaction service initialized');
  }

  async connectWallet(): Promise<string> {
    if (!window.vechain) {
      throw new Error('VeWorld wallet not found');
    }

    try {
      console.log('Connecting to VeWorld wallet...');
      
      // Request account access
      const accounts = await window.vechain.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
      this.currentAccount = account;
      this.isConnected = true;
      
      console.log('Account connected:', account);
      return account;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  // Helper function to encode function calls
  private encodeFunctionCall(functionName: string, params: any[]): string {
    // This is a simplified ABI encoder - in production, use a proper ABI encoder
    // For now, we'll use a basic approach
    const functionSignatures: { [key: string]: string } = {
      'askQuestion': '0x12345678', // Placeholder - would need proper ABI encoding
      'submitAnswer': '0x87654321',
      'upvoteAnswer': '0x11111111',
      'approveAnswer': '0x22222222'
    };
    
    return functionSignatures[functionName] || '0x';
  }

  // Helper function to convert VET to Wei
  private vetToWei(vet: string): string {
    const vetAmount = parseFloat(vet);
    const weiAmount = vetAmount * Math.pow(10, 18);
    return Math.floor(weiAmount).toString();
  }

  async askQuestion(question: string, bounty: string): Promise<string> {
    if (!this.isConnected || !this.currentAccount) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    try {
      console.log('Sending VeChain askQuestion transaction...');
      console.log('Question:', question);
      console.log('Bounty:', bounty);
      
      const bountyWei = this.vetToWei(bounty);
      console.log('Bounty in Wei:', bountyWei);
      
      // Create transaction
      const tx: Transaction = {
        to: this.contractAddress,
        value: bountyWei,
        data: this.encodeFunctionCall('askQuestion', [question, bountyWei]),
        gas: 100000, // Gas limit
        gasPrice: '1000000000', // 1 Gwei
      };

      console.log('Transaction created:', tx);
      
      // Send transaction through VeWorld
      const txHash = await window.vechain.request({
        method: 'eth_sendTransaction',
        params: [tx]
      });
      
      console.log('Transaction sent:', txHash);
      return txHash;
    } catch (error) {
      console.error('Failed to ask question:', error);
      throw error;
    }
  }

  async submitAnswer(questionId: number, answer: string): Promise<string> {
    if (!this.isConnected || !this.currentAccount) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    try {
      console.log('Sending VeChain submitAnswer transaction...');
      console.log('Question ID:', questionId);
      console.log('Answer:', answer);
      
      // Create transaction
      const tx: Transaction = {
        to: this.contractAddress,
        value: '0',
        data: this.encodeFunctionCall('submitAnswer', [questionId, answer]),
        gas: 100000,
        gasPrice: '1000000000',
      };

      console.log('Transaction created:', tx);
      
      // Send transaction through VeWorld
      const txHash = await window.vechain.request({
        method: 'eth_sendTransaction',
        params: [tx]
      });
      
      console.log('Transaction sent:', txHash);
      return txHash;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  }

  async upvoteAnswer(questionId: number, answerId: number): Promise<string> {
    if (!this.isConnected || !this.currentAccount) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    try {
      console.log('Sending VeChain upvoteAnswer transaction...');
      console.log('Question ID:', questionId);
      console.log('Answer ID:', answerId);
      
      // Create transaction
      const tx: Transaction = {
        to: this.contractAddress,
        value: '0',
        data: this.encodeFunctionCall('upvoteAnswer', [questionId, answerId]),
        gas: 100000,
        gasPrice: '1000000000',
      };

      console.log('Transaction created:', tx);
      
      // Send transaction through VeWorld
      const txHash = await window.vechain.request({
        method: 'eth_sendTransaction',
        params: [tx]
      });
      
      console.log('Transaction sent:', txHash);
      return txHash;
    } catch (error) {
      console.error('Failed to upvote answer:', error);
      throw error;
    }
  }

  async approveAnswer(questionId: number, answerId: number): Promise<string> {
    if (!this.isConnected || !this.currentAccount) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    try {
      console.log('Sending VeChain approveAnswer transaction...');
      console.log('Question ID:', questionId);
      console.log('Answer ID:', answerId);
      
      // Create transaction
      const tx: Transaction = {
        to: this.contractAddress,
        value: '0',
        data: this.encodeFunctionCall('approveAnswer', [questionId, answerId]),
        gas: 100000,
        gasPrice: '1000000000',
      };

      console.log('Transaction created:', tx);
      
      // Send transaction through VeWorld
      const txHash = await window.vechain.request({
        method: 'eth_sendTransaction',
        params: [tx]
      });
      
      console.log('Transaction sent:', txHash);
      return txHash;
    } catch (error) {
      console.error('Failed to approve answer:', error);
      throw error;
    }
  }

  async getPlatformStats() {
    // For now, return mock data - would need to implement contract calls
    return {
      totalQuestions: '0',
      totalAnswers: '0',
      totalUsers: '0'
    };
  }

  async getQuestion(questionId: number) {
    // For now, return mock data - would need to implement contract calls
    return {
      asker: '0x0000000000000000000000000000000000000000',
      question: 'Mock question',
      bounty: '0',
      isResolved: false,
      approvedAnswerId: '0'
    };
  }

  async getAnswer(questionId: number, answerId: number) {
    // For now, return mock data - would need to implement contract calls
    return {
      answerer: '0x0000000000000000000000000000000000000000',
      answer: 'Mock answer',
      upvotes: '0',
      isApproved: false
    };
  }

  // Debug method to check service status
  getServiceStatus() {
    return {
      isConnected: this.isConnected,
      currentAccount: this.currentAccount,
      contractAddress: this.contractAddress
    };
  }
}

// Export singleton instance
export const vechainTransactionService = new VeChainTransactionService();
