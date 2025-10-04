// Mock contract service for testing without real VeChain deployment
import { ethers } from 'ethers';

interface Question {
  id: number;
  asker: string;
  question: string;
  bounty: string;
  isResolved: boolean;
  approvedAnswerId: string;
}

interface Answer {
  id: number;
  answerer: string;
  answer: string;
  upvotes: string;
  isApproved: boolean;
}

interface PlatformStats {
  totalQuestions: string;
  totalAnswers: string;
  totalUsers: string;
}

export class MockContractService {
  private questions: Question[] = [];
  private answers: Answer[] = [];
  private users: string[] = [];
  private userReputations: { [key: string]: number } = {};

  async getPlatformStats(): Promise<PlatformStats> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalQuestions: this.questions.length.toString(),
      totalAnswers: this.answers.length.toString(),
      totalUsers: this.users.length.toString()
    };
  }

  async registerUser(username: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    // Add user to mock data
    if (!this.users.includes(username)) {
      this.users.push(username);
    }
    
    return txHash;
  }

  async askQuestion(question: string, bounty: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    // Add question to mock data
    const newQuestion: Question = {
      id: this.questions.length + 1,
      asker: '0x1234567890123456789012345678901234567890', // Mock address
      question,
      bounty,
      isResolved: false,
      approvedAnswerId: '0'
    };
    
    this.questions.push(newQuestion);
    
    return txHash;
  }

  async submitAnswer(questionId: number, answer: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    // Add answer to mock data
    const newAnswer: Answer = {
      id: this.answers.length + 1,
      answerer: '0x1234567890123456789012345678901234567890', // Mock address
      answer,
      upvotes: '0',
      isApproved: false
    };
    
    this.answers.push(newAnswer);
    
    return txHash;
  }

  async upvoteAnswer(questionId: number, answerId: number): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    // Update answer upvotes
    const answer = this.answers.find(a => a.id === answerId);
    if (answer) {
      answer.upvotes = (parseInt(answer.upvotes) + 1).toString();
    }
    
    return txHash;
  }

  async approveAnswer(questionId: number, answerId: number): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    // Update answer approval
    const answer = this.answers.find(a => a.id === answerId);
    if (answer) {
      answer.isApproved = true;
    }
    
    // Update question
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      question.isResolved = true;
      question.approvedAnswerId = answerId.toString();
    }
    
    return txHash;
  }

  async getQuestion(questionId: number): Promise<Question> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const question = this.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }
    
    return question;
  }

  async getAnswer(questionId: number, answerId: number): Promise<Answer> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const answer = this.answers.find(a => a.id === answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }
    
    return answer;
  }

  async getUserReputation(userAddress: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.userReputations[userAddress]?.toString() || '0';
  }

  // Mock data for demonstration
  async loadMockData() {
    // Add some mock questions
    this.questions = [
      {
        id: 1,
        asker: '0x1234567890123456789012345678901234567890',
        question: 'How do I deploy a smart contract on VeChain?',
        bounty: '1.0',
        isResolved: false,
        approvedAnswerId: '0'
      },
      {
        id: 2,
        asker: '0x2345678901234567890123456789012345678901',
        question: 'What is the difference between VET and VTHO?',
        bounty: '0.5',
        isResolved: true,
        approvedAnswerId: '1'
      }
    ];
    
    // Add some mock answers
    this.answers = [
      {
        id: 1,
        answerer: '0x3456789012345678901234567890123456789012',
        answer: 'You can deploy smart contracts on VeChain using tools like Hardhat, Truffle, or Remix. Make sure to have VET for gas fees.',
        upvotes: '5',
        isApproved: true
      },
      {
        id: 2,
        answerer: '0x4567890123456789012345678901234567890123',
        answer: 'VET is the native token of VeChain, while VTHO is the gas token used for transaction fees.',
        upvotes: '3',
        isApproved: false
      }
    ];
    
    // Add some mock users
    this.users = [
      '0x1234567890123456789012345678901234567890',
      '0x2345678901234567890123456789012345678901',
      '0x3456789012345678901234567890123456789012'
    ];
    
    // Add some mock reputations
    this.userReputations = {
      '0x1234567890123456789012345678901234567890': 100,
      '0x2345678901234567890123456789012345678901': 50,
      '0x3456789012345678901234567890123456789012': 75
    };
  }
}

// Export singleton instance
export const mockContractService = new MockContractService();

