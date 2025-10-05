// Real VeChain transaction service using ethers.js and VeWorld wallet
import { ethers } from 'ethers';

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

export class RealVeChainTransactionService {
  private contract: ethers.Contract | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.vechain) {
      try {
        console.log('Initializing VeWorld provider...');
        
        // Create provider using VeWorld
        this.provider = new ethers.BrowserProvider(window.vechain);
        
        // Create contract instance
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          SIMPLE_QA_ABI,
          this.provider
        );
        
        console.log('VeWorld provider initialized successfully');
        console.log('Contract address:', CONTRACT_ADDRESS);
      } catch (error) {
        console.error('Failed to initialize VeWorld provider:', error);
      }
    }
  }

  async connectWallet(): Promise<string> {
    if (!window.vechain) {
      throw new Error('VeWorld wallet not found');
    }

    try {
      console.log('Connecting to VeWorld wallet...');
      console.log('Provider available:', !!this.provider);
      console.log('Contract available:', !!this.contract);
      
      // Request account access
      const accounts = await window.vechain.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
      console.log('Account connected:', account);
      
      // Get signer
      this.signer = await this.provider?.getSigner(account);
      console.log('Signer created:', !!this.signer);
      
      // Update contract with signer
      if (this.contract && this.signer) {
        this.contract = this.contract.connect(this.signer);
        console.log('Contract connected with signer');
        console.log('Contract address:', this.contract.target);
      } else {
        console.error('Contract or signer not available for connection');
        console.error('Contract:', !!this.contract);
        console.error('Signer:', !!this.signer);
      }
      
      return account;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async askQuestion(question: string, bounty: string): Promise<string> {
    // Ensure contract and signer are available
    if (!this.contract || !this.signer) {
      console.log('Contract or signer not available, attempting to reconnect...');
      await this.connectWallet();
      
      if (!this.contract || !this.signer) {
        throw new Error('Contract or signer not available. Please connect your wallet first.');
      }
    }

    try {
      console.log('Sending real askQuestion transaction...');
      console.log('Question:', question);
      console.log('Bounty:', bounty);
      
      const bountyWei = ethers.parseEther(bounty);
      console.log('Bounty in Wei:', bountyWei.toString());
      
      // Send transaction
      const tx = await this.contract.askQuestion(question, bountyWei, {
        value: bountyWei
      });
      
      console.log('Transaction sent:', tx.hash);
      console.log('Waiting for confirmation...');
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to ask question:', error);
      throw error;
    }
  }

  async submitAnswer(questionId: number, answer: string): Promise<string> {
    // Ensure contract and signer are available
    if (!this.contract || !this.signer) {
      console.log('Contract or signer not available, attempting to reconnect...');
      await this.connectWallet();
      
      if (!this.contract || !this.signer) {
        throw new Error('Contract or signer not available. Please connect your wallet first.');
      }
    }

    try {
      console.log('Sending real submitAnswer transaction...');
      console.log('Question ID:', questionId);
      console.log('Answer:', answer);
      
      const tx = await this.contract.submitAnswer(questionId, answer);
      
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  }

  async upvoteAnswer(questionId: number, answerId: number): Promise<string> {
    // Ensure contract and signer are available
    if (!this.contract || !this.signer) {
      console.log('Contract or signer not available, attempting to reconnect...');
      await this.connectWallet();
      
      if (!this.contract || !this.signer) {
        throw new Error('Contract or signer not available. Please connect your wallet first.');
      }
    }

    try {
      console.log('Sending real upvoteAnswer transaction...');
      console.log('Question ID:', questionId);
      console.log('Answer ID:', answerId);
      
      const tx = await this.contract.upvoteAnswer(questionId, answerId);
      
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to upvote answer:', error);
      throw error;
    }
  }

  async approveAnswer(questionId: number, answerId: number): Promise<string> {
    // Ensure contract and signer are available
    if (!this.contract || !this.signer) {
      console.log('Contract or signer not available, attempting to reconnect...');
      await this.connectWallet();
      
      if (!this.contract || !this.signer) {
        throw new Error('Contract or signer not available. Please connect your wallet first.');
      }
    }

    try {
      console.log('Sending real approveAnswer transaction...');
      console.log('Question ID:', questionId);
      console.log('Answer ID:', answerId);
      
      const tx = await this.contract.approveAnswer(questionId, answerId);
      
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to approve answer:', error);
      throw error;
    }
  }

  async getPlatformStats() {
    if (!this.contract) {
      throw new Error('Contract not available');
    }

    try {
      const stats = await this.contract.getPlatformStats();
      return {
        totalQuestions: stats[0].toString(),
        totalAnswers: stats[1].toString(),
        totalUsers: stats[2].toString()
      };
    } catch (error) {
      console.error('Failed to get platform stats:', error);
      throw error;
    }
  }

  async getQuestion(questionId: number) {
    if (!this.contract) {
      throw new Error('Contract not available');
    }

    try {
      const question = await this.contract.getQuestion(questionId);
      return {
        asker: question[0],
        question: question[1],
        bounty: question[2].toString(),
        isResolved: question[3],
        approvedAnswerId: question[4].toString()
      };
    } catch (error) {
      console.error('Failed to get question:', error);
      throw error;
    }
  }

  async getAnswer(questionId: number, answerId: number) {
    if (!this.contract) {
      throw new Error('Contract not available');
    }

    try {
      const answer = await this.contract.getAnswer(questionId, answerId);
      return {
        answerer: answer[0],
        answer: answer[1],
        upvotes: answer[2].toString(),
        isApproved: answer[3]
      };
    } catch (error) {
      console.error('Failed to get answer:', error);
      throw error;
    }
  }

  // Debug method to check contract status
  getContractStatus() {
    return {
      provider: !!this.provider,
      contract: !!this.contract,
      signer: !!this.signer,
      contractAddress: this.contract?.target || 'Not available'
    };
  }
}

// Export singleton instance
export const realVeChainTransactionService = new RealVeChainTransactionService();
