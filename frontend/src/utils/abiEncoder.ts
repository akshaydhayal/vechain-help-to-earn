// ABI encoder for VeChain contract interactions
import { ethers } from 'ethers';

// Contract ABI for SimpleQA
export const SIMPLE_QA_ABI = [
  "function askQuestion(string memory _title, string memory _description) external payable",
  "function submitAnswer(uint256 questionId, string memory answer) external",
  "function upvoteAnswer(uint256 questionId, uint256 answerId) external",
  "function approveAnswer(uint256 questionId, uint256 answerId) external",
  "function registerUser(string memory username) external",
  "function getPlatformStats() view returns (uint256 totalQuestions, uint256 totalAnswers, uint256 totalUsers)",
  "function getQuestion(uint256 questionId) view returns (address asker, string question, uint256 bounty, bool isResolved, uint256 approvedAnswerId)",
  "function getAnswer(uint256 questionId, uint256 answerId) view returns (address answerer, string answer, uint256 upvotes, bool isApproved)"
];

export class ABIEncoder {
  private iface: ethers.Interface;

  constructor() {
    this.iface = new ethers.Interface(SIMPLE_QA_ABI);
  }

  // Encode askQuestion function call
  encodeAskQuestion(title: string, description: string): string {
    try {
      return this.iface.encodeFunctionData('askQuestion', [title, description]);
    } catch (error) {
      console.error('Error encoding askQuestion:', error);
      throw error;
    }
  }

  // Encode submitAnswer function call
  encodeSubmitAnswer(questionId: number, answer: string): string {
    try {
      return this.iface.encodeFunctionData('submitAnswer', [questionId, answer]);
    } catch (error) {
      console.error('Error encoding submitAnswer:', error);
      throw error;
    }
  }

  // Encode upvoteAnswer function call
  encodeUpvoteAnswer(questionId: number, answerId: number): string {
    try {
      return this.iface.encodeFunctionData('upvoteAnswer', [questionId, answerId]);
    } catch (error) {
      console.error('Error encoding upvoteAnswer:', error);
      throw error;
    }
  }

  // Encode approveAnswer function call
  encodeApproveAnswer(questionId: number, answerId: number): string {
    try {
      return this.iface.encodeFunctionData('approveAnswer', [questionId, answerId]);
    } catch (error) {
      console.error('Error encoding approveAnswer:', error);
      throw error;
    }
  }

  // Encode registerUser function call
  encodeRegisterUser(username: string): string {
    try {
      return this.iface.encodeFunctionData('registerUser', [username]);
    } catch (error) {
      console.error('Error encoding registerUser:', error);
      throw error;
    }
  }

  // Helper function to convert VET to Wei
  vetToWei(vet: string): string {
    try {
      const vetAmount = parseFloat(vet);
      const weiAmount = vetAmount * Math.pow(10, 18);
      return Math.floor(weiAmount).toString();
    } catch (error) {
      console.error('Error converting VET to Wei:', error);
      throw error;
    }
  }

  // Helper function to convert Wei to VET
  weiToVet(wei: string): string {
    try {
      const weiAmount = BigInt(wei);
      const vetAmount = Number(weiAmount) / Math.pow(10, 18);
      return vetAmount.toString();
    } catch (error) {
      console.error('Error converting Wei to VET:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const abiEncoder = new ABIEncoder();

