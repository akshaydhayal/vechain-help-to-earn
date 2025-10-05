// VeChain Connex-based transaction service for VeWorld wallet
// This uses the VeChain Connex API that VeWorld wallet actually supports

export class VeChainConnexService {
  private contractAddress: string;
  private isConnected: boolean = false;
  private currentAccount: string | null = null;
  private connex: any = null;

  constructor() {
    this.contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    console.log('VeChain Connex service initialized');
  }

  async connectWallet(): Promise<string> {
    if (!window.vechain) {
      throw new Error('VeWorld wallet not found');
    }

    try {
      console.log('Connecting to VeWorld wallet via Connex...');
      
      // Initialize Connex
      if (window.vechain.newConnexSigner) {
        const signer = window.vechain.newConnexSigner('test');
        this.connex = signer;
        console.log('Connex signer initialized');
        console.log('Connex signer methods:', Object.keys(signer));
      } else {
        throw new Error('Connex signer not available');
      }

      // Try different connection methods
      let result: any;
      
      // Method 1: Try direct connect
      if (this.connex.connect) {
        console.log('Trying connex.connect()...');
        result = await this.connex.connect();
      }
      // Method 2: Try request method
      else if (this.connex.request) {
        console.log('Trying connex.request()...');
        result = await this.connex.request({ method: 'eth_requestAccounts' });
      }
      // Method 3: Try getAccount
      else if (this.connex.getAccount) {
        console.log('Trying connex.getAccount()...');
        result = await this.connex.getAccount();
      }
      // Method 4: Fallback to direct VeWorld wallet connection
      else {
        console.log('Connex methods not available, trying direct VeWorld connection...');
        if (window.vechain.connect) {
          result = await window.vechain.connect();
        } else if (window.vechain.request) {
          result = await window.vechain.request({ method: 'eth_requestAccounts' });
        } else {
          throw new Error('No compatible connection method found');
        }
      }

      console.log('Connection result:', result);
      
      // Handle different response formats
      if (result && typeof result === 'object' && 'account' in result) {
        this.currentAccount = result.account;
      } else if (result && Array.isArray(result) && result.length > 0) {
        this.currentAccount = result[0];
      } else if (typeof result === 'string' && result.startsWith('0x')) {
        this.currentAccount = result;
      } else {
        throw new Error('No account received from Connex signer');
      }
      
      this.isConnected = true;
      console.log('Account connected via Connex:', this.currentAccount);
      return this.currentAccount;
    } catch (error) {
      console.error('Failed to connect wallet via Connex:', error);
      throw error;
    }
  }

  // Helper function to create VeChain transaction clauses
  private createTransactionClause(to: string, value: string, data: string) {
    return {
      to: to,
      value: value,
      data: data
    };
  }

  // Helper function to encode function calls (simplified)
  private encodeFunctionCall(functionName: string, params: any[]): string {
    // This is a simplified approach - in production, use proper ABI encoding
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
    // Check if wallet is connected, if not try to reconnect
    if (!this.isConnected || !this.currentAccount) {
      console.log('Wallet not connected, attempting to reconnect...');
      await this.connectWallet();
      
      if (!this.isConnected || !this.currentAccount) {
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }
    }

    try {
      console.log('Sending VeChain askQuestion transaction via Connex...');
      console.log('Question:', question);
      console.log('Bounty:', bounty);
      
      const bountyWei = this.vetToWei(bounty);
      console.log('Bounty in Wei:', bountyWei);
      
      // Create transaction clause
      const clause = this.createTransactionClause(
        this.contractAddress,
        bountyWei,
        this.encodeFunctionCall('askQuestion', [question, bountyWei])
      );

      console.log('Transaction clause created:', clause);
      
      // For now, we'll simulate the transaction since we need proper ABI encoding
      // In a real implementation, you would use the Connex API to send the transaction
      console.log('Simulating VeChain transaction...');
      
      // Simulate transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      console.log('Simulated transaction hash:', txHash);
      
      return txHash;
    } catch (error) {
      console.error('Failed to ask question:', error);
      throw error;
    }
  }

  async submitAnswer(questionId: number, answer: string): Promise<string> {
    // Check if wallet is connected, if not try to reconnect
    if (!this.isConnected || !this.currentAccount) {
      console.log('Wallet not connected, attempting to reconnect...');
      await this.connectWallet();
      
      if (!this.isConnected || !this.currentAccount) {
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }
    }

    try {
      console.log('Sending VeChain submitAnswer transaction via Connex...');
      console.log('Question ID:', questionId);
      console.log('Answer:', answer);
      
      // Create transaction clause
      const clause = this.createTransactionClause(
        this.contractAddress,
        '0',
        this.encodeFunctionCall('submitAnswer', [questionId, answer])
      );

      console.log('Transaction clause created:', clause);
      
      // Simulate transaction
      const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      console.log('Simulated transaction hash:', txHash);
      
      return txHash;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    }
  }

  async upvoteAnswer(questionId: number, answerId: number): Promise<string> {
    // Check if wallet is connected, if not try to reconnect
    if (!this.isConnected || !this.currentAccount) {
      console.log('Wallet not connected, attempting to reconnect...');
      await this.connectWallet();
      
      if (!this.isConnected || !this.currentAccount) {
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }
    }

    try {
      console.log('Sending VeChain upvoteAnswer transaction via Connex...');
      console.log('Question ID:', questionId);
      console.log('Answer ID:', answerId);
      
      // Create transaction clause
      const clause = this.createTransactionClause(
        this.contractAddress,
        '0',
        this.encodeFunctionCall('upvoteAnswer', [questionId, answerId])
      );

      console.log('Transaction clause created:', clause);
      
      // Simulate transaction
      const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      console.log('Simulated transaction hash:', txHash);
      
      return txHash;
    } catch (error) {
      console.error('Failed to upvote answer:', error);
      throw error;
    }
  }

  async approveAnswer(questionId: number, answerId: number): Promise<string> {
    // Check if wallet is connected, if not try to reconnect
    if (!this.isConnected || !this.currentAccount) {
      console.log('Wallet not connected, attempting to reconnect...');
      await this.connectWallet();
      
      if (!this.isConnected || !this.currentAccount) {
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }
    }

    try {
      console.log('Sending VeChain approveAnswer transaction via Connex...');
      console.log('Question ID:', questionId);
      console.log('Answer ID:', answerId);
      
      // Create transaction clause
      const clause = this.createTransactionClause(
        this.contractAddress,
        '0',
        this.encodeFunctionCall('approveAnswer', [questionId, answerId])
      );

      console.log('Transaction clause created:', clause);
      
      // Simulate transaction
      const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      console.log('Simulated transaction hash:', txHash);
      
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
      contractAddress: this.contractAddress,
      connexAvailable: !!this.connex
    };
  }
}

// Export singleton instance
export const vechainConnexService = new VeChainConnexService();
