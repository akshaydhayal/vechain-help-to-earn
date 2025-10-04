// Smart contract interaction utilities
import { ethers } from 'ethers';

// Contract ABI - this will be generated from the deployed contract
const SIMPLE_QA_ABI = [
  // Events
  "event QuestionAsked(uint256 indexed questionId, address indexed asker, string question, uint256 bounty)",
  "event AnswerSubmitted(uint256 indexed questionId, uint256 indexed answerId, address indexed answerer, string answer)",
  "event AnswerUpvoted(uint256 indexed questionId, uint256 indexed answerId, address indexed upvoter)",
  "event AnswerApproved(uint256 indexed questionId, uint256 indexed answerId, address indexed approver)",
  "event UserRegistered(address indexed user, string username)",
  
  // View functions
  "function getPlatformStats() view returns (uint256 totalQuestions, uint256 totalAnswers, uint256 totalUsers)",
  "function getQuestion(uint256 questionId) view returns (address asker, string question, uint256 bounty, bool isResolved, uint256 approvedAnswerId)",
  "function getAnswer(uint256 questionId, uint256 answerId) view returns (address answerer, string answer, uint256 upvotes, bool isApproved)",
  "function getUserReputation(address user) view returns (uint256 reputation)",
  "function getQuestionAnswers(uint256 questionId) view returns (uint256[] memory answerIds)",
  
  // Write functions
  "function registerUser(string memory username) external",
  "function askQuestion(string memory question, uint256 bounty) external payable",
  "function submitAnswer(uint256 questionId, string memory answer) external",
  "function upvoteAnswer(uint256 questionId, uint256 answerId) external",
  "function approveAnswer(uint256 questionId, uint256 answerId) external",
  "function withdrawBounty(uint256 questionId) external"
];

// Contract configuration
const CONTRACT_CONFIG = {
  // Real deployed contract address from localhost deployment
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  abi: SIMPLE_QA_ABI,
  network: 'hardhat' // Using localhost for now
};

export class ContractService {
  private contract: ethers.Contract | null = null;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.vechain) {
      try {
        // Use VeWorld provider
        this.provider = new ethers.BrowserProvider(window.vechain);
        this.contract = new ethers.Contract(
          CONTRACT_CONFIG.address,
          CONTRACT_CONFIG.abi,
          this.provider
        );
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
      // Request account access
      const accounts = await window.vechain.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
      // Get signer
      this.signer = await this.provider?.getSigner(account);
      
      // Update contract with signer
      if (this.contract && this.signer) {
        this.contract = this.contract.connect(this.signer);
      }
      
      return account;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async getPlatformStats() {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const stats = await this.contract.getPlatformStats();
      return {
        totalQuestions: stats.totalQuestions.toString(),
        totalAnswers: stats.totalAnswers.toString(),
        totalUsers: stats.totalUsers.toString()
      };
    } catch (error) {
      console.error('Failed to get platform stats:', error);
      throw error;
    }
  }

  async registerUser(username: string) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not available');
    }

    try {
      const tx = await this.contract.registerUser(username);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  }

  async askQuestion(question: string, bounty: string) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not available');
    }

    try {
      const bountyWei = ethers.parseEther(bounty);
      const tx = await this.contract.askQuestion(question, bountyWei, {
        value: bountyWei
      });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to ask question:', error);
      throw error;
    }
  }

  async submitAnswer(questionId: number, answer: string) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not available');
    }

    try {
      const tx = await this.contract.submitAnswer(questionId, answer);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  }

  async upvoteAnswer(questionId: number, answerId: number) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not available');
    }

    try {
      const tx = await this.contract.upvoteAnswer(questionId, answerId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to upvote answer:', error);
      throw error;
    }
  }

  async approveAnswer(questionId: number, answerId: number) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not available');
    }

    try {
      const tx = await this.contract.approveAnswer(questionId, answerId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to approve answer:', error);
      throw error;
    }
  }

  async getQuestion(questionId: number) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const question = await this.contract.getQuestion(questionId);
      return {
        asker: question.asker,
        question: question.question,
        bounty: question.bounty.toString(),
        isResolved: question.isResolved,
        approvedAnswerId: question.approvedAnswerId.toString()
      };
    } catch (error) {
      console.error('Failed to get question:', error);
      throw error;
    }
  }

  async getAnswer(questionId: number, answerId: number) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const answer = await this.contract.getAnswer(questionId, answerId);
      return {
        answerer: answer.answerer,
        answer: answer.answer,
        upvotes: answer.upvotes.toString(),
        isApproved: answer.isApproved
      };
    } catch (error) {
      console.error('Failed to get answer:', error);
      throw error;
    }
  }

  async getUserReputation(userAddress: string) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const reputation = await this.contract.getUserReputation(userAddress);
      return reputation.toString();
    } catch (error) {
      console.error('Failed to get user reputation:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const contractService = new ContractService();

