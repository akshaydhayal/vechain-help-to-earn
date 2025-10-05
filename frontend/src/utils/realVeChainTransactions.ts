// Real VeChain blockchain transaction service
// This will send actual transactions to VeChain testnet

import { ethers } from 'ethers';

// VeChain Testnet RPC URL
const VECHAIN_TESTNET_RPC = 'https://testnet.vechain.org';

// Contract ABI for SimpleQA
const SIMPLE_QA_ABI = [
  "function askQuestion(string memory question, uint256 bounty) external payable",
  "function submitAnswer(uint256 questionId, string memory answer) external",
  "function upvoteAnswer(uint256 questionId, uint256 answerId) external",
  "function approveAnswer(uint256 questionId, uint256 answerId) external",
  "function registerUser(string memory username) external",
  "function getPlatformStats() view returns (uint256 totalQuestions, uint256 totalAnswers, uint256 totalUsers)"
];

export class RealVeChainTransactions {
  private contractAddress: string;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;
  private isConnected: boolean = false;
  private currentAccount: string | null = null;

  constructor() {
    this.contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Deployed contract address
    console.log('Real VeChain Transactions service initialized');
  }

  async connectWallet(): Promise<string> {
    if (!window.vechain) {
      throw new Error('VeWorld wallet not found');
    }

    try {
      console.log('Connecting to VeWorld wallet for REAL transactions...');
      
      // Create provider using VeWorld wallet
      this.provider = new ethers.BrowserProvider(window.vechain);
      
      // Get signer
      this.signer = await this.provider.getSigner();
      
      // Get account
      this.currentAccount = await this.signer.getAddress();
      this.isConnected = true;
      
      // Create contract instance
      this.contract = new ethers.Contract(this.contractAddress, SIMPLE_QA_ABI, this.signer);
      
      console.log('REAL VeChain connection established:', this.currentAccount);
      return this.currentAccount;
      
    } catch (error) {
      console.error('Failed to connect to VeWorld for real transactions:', error);
      throw error;
    }
  }

  async askQuestion(question: string, bounty: string): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not connected. Please connect your wallet first.');
    }

    try {
      console.log('Sending REAL VeChain testnet transaction...');
      console.log('Question:', question);
      console.log('Bounty:', bounty);
      
      const bountyWei = ethers.parseEther(bounty);
      console.log('Bounty in Wei:', bountyWei.toString());
      
      // Send real transaction to VeChain testnet
      const tx = await this.contract.askQuestion(question, bountyWei, {
        value: bountyWei,
        gasLimit: 100000
      });
      
      console.log('REAL transaction sent to VeChain testnet:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('REAL transaction confirmed on VeChain testnet:', receipt);
      
      return tx.hash;
      
    } catch (error) {
      console.error('REAL VeChain transaction failed:', error);
      throw error;
    }
  }

  async submitAnswer(questionId: number, answer: string): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not connected. Please connect your wallet first.');
    }

    try {
      console.log('Sending REAL VeChain testnet transaction for submitAnswer...');
      
      const tx = await this.contract.submitAnswer(questionId, answer, {
        gasLimit: 100000
      });
      
      console.log('REAL transaction sent to VeChain testnet:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('REAL transaction confirmed on VeChain testnet:', receipt);
      
      return tx.hash;
      
    } catch (error) {
      console.error('REAL VeChain transaction failed:', error);
      throw error;
    }
  }

  async upvoteAnswer(questionId: number, answerId: number): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not connected. Please connect your wallet first.');
    }

    try {
      console.log('Sending REAL VeChain testnet transaction for upvoteAnswer...');
      
      const tx = await this.contract.upvoteAnswer(questionId, answerId, {
        gasLimit: 100000
      });
      
      console.log('REAL transaction sent to VeChain testnet:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('REAL transaction confirmed on VeChain testnet:', receipt);
      
      return tx.hash;
      
    } catch (error) {
      console.error('REAL VeChain transaction failed:', error);
      throw error;
    }
  }

  async approveAnswer(questionId: number, answerId: number): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not connected. Please connect your wallet first.');
    }

    try {
      console.log('Sending REAL VeChain testnet transaction for approveAnswer...');
      
      const tx = await this.contract.approveAnswer(questionId, answerId, {
        gasLimit: 100000
      });
      
      console.log('REAL transaction sent to VeChain testnet:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('REAL transaction confirmed on VeChain testnet:', receipt);
      
      return tx.hash;
      
    } catch (error) {
      console.error('REAL VeChain transaction failed:', error);
      throw error;
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      currentAccount: this.currentAccount,
      contractAddress: this.contractAddress,
      hasProvider: !!this.provider,
      hasSigner: !!this.signer,
      hasContract: !!this.contract
    };
  }
}

// Export singleton instance
export const realVeChainTransactions = new RealVeChainTransactions();


