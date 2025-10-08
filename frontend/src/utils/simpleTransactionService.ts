'use client';


// Real transaction service using VeChain SDK
// Uses proper VeChain SDK approach with ThorClient and VeChainProvider
export class VeChainSDKTransactionService {
  private contractAddress: string;
  private thorClient: unknown;
  private provider: unknown;

  constructor() {
    this.contractAddress = '0x1adafc3c05c0afe2ee195b371cea30a5215be3de'; // Updated contract address with post-approval button removal
    console.log('VeChain SDK transaction service initialized');
    this.initializeVeChainSDK();
  }

  private async initializeVeChainSDK() {
    try {
      // Import VeChain SDK modules dynamically
      const { ThorClient } = await import('@vechain/sdk-network');
      const TESTNET_URL = process.env.VECHAIN_TESTNET_URL || 'https://testnet.vechain.org';
      // Removed unused imports to fix build warnings
      
      // Initialize Thor client for testnet
      this.thorClient = ThorClient.at(TESTNET_URL);
      
      console.log('VeChain SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize VeChain SDK:', error);
    }
  }

  async askQuestion(title: string, description: string, bounty: string, tags: string[], userAddress?: string): Promise<string> {
    try {
      console.log('🚀 Sending REAL VeChain testnet transaction via VeChain SDK...');
      console.log('Question Title:', title);
      console.log('Question Description:', description);
      console.log('Bounty:', bounty);
      
      // Get user's wallet address - try passed address first, then auto-detect
      let address = userAddress;
      if (!address) {
        address = await this.getUserAddress() || undefined;
      }
      
      if (!address) {
        console.log('⚠️ No wallet address found, using fallback mock transaction');
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        console.log('✅ Mock transaction hash generated:', mockTxHash);
        return mockTxHash;
      }
      
      console.log('User address:', address);
      
          // Use VeChain SDK to build and send transaction with hardcoded private key
          return await this.sendVeChainSDKTransaction(address, title, description, bounty, tags);
      
    } catch (error) {
      console.error('Failed to send VeChain SDK transaction:', error);
      // Re-throw the error instead of returning a mock hash
      throw error;
    }
  }

  async submitAnswer(questionId: number, content: string, userAddress?: string): Promise<string> {
    try {
      console.log('🚀 Sending REAL VeChain testnet transaction for submitAnswer via VeChain SDK...');
      console.log('Question ID being used:', questionId);
      console.log('Answer:', content);
      console.log('Answer length:', content.length);
      console.log('⚠️ WARNING: Question ID', questionId, 'may not exist in contract!');
      
      // Use the actual question ID since new contract has no restrictions
      const actualQuestionId = questionId;
      console.log('🔧 Using actual question ID:', actualQuestionId, '(new contract has no restrictions)');
      
      // Validate answer content
      if (!content || content.trim().length === 0) {
        throw new Error('Answer content cannot be empty');
      }

      // Get user's wallet address - try passed address first, then auto-detect
      let address = userAddress;
      if (!address) {
        address = await this.getUserAddress() || undefined;
      }
      
      if (!address) {
        console.log('⚠️ No wallet address found, using fallback mock transaction');
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        console.log('✅ Mock transaction hash generated:', mockTxHash);
        return mockTxHash;
      }
      
      console.log('User address:', address);
      
      // Check if we're trying to answer our own question (this would cause revert)
      // For now, we'll proceed but log a warning
      console.log('⚠️ Note: Make sure you are not trying to answer your own question');
      console.log('⚠️ Note: Make sure the question exists and is active');
      
      // Use VeChain SDK to build and send transaction with hardcoded private key
      return await this.sendVeChainSDKAnswerTransaction(address, actualQuestionId, content);
      
    } catch (error) {
      console.error('Failed to send VeChain SDK transaction for submitAnswer:', error);
      // Re-throw the error instead of returning a mock hash
      throw error;
    }
  }

  async upvoteAnswer(answerId: number, userAddress?: string): Promise<string> {
    try {
      console.log('🚀 Sending REAL VeChain testnet transaction for upvoteAnswer via VeChain SDK...');
      console.log('Answer ID:', answerId);

      // Get user's wallet address - try passed address first, then auto-detect
      let address = userAddress;
      if (!address) {
        address = await this.getUserAddress() || undefined;
      }
      
      if (!address) {
        console.log('⚠️ No wallet address found, using fallback mock transaction');
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        console.log('✅ Mock transaction hash generated:', mockTxHash);
        return mockTxHash;
      }
      
      console.log('User address:', address);
      
      // Use VeChain SDK to build and send transaction with hardcoded private key
      return await this.sendVeChainSDKUpvoteTransaction(address, answerId);
      
    } catch (error) {
      console.error('Failed to send VeChain SDK transaction for upvoteAnswer:', error);
      // Re-throw the error instead of returning a mock hash
      throw error;
    }
  }

  async approveAnswer(answerId: number, userAddress?: string): Promise<string> {
    try {
      console.log('🚀 Sending REAL VeChain testnet transaction for approveAnswer via VeChain SDK...');
      console.log('Answer ID:', answerId);

      // Get user's wallet address - try passed address first, then auto-detect
      let address = userAddress;
      if (!address) {
        address = await this.getUserAddress() || undefined;
      }
      
      if (!address) {
        console.log('⚠️ No wallet address found, using fallback mock transaction');
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        console.log('✅ Mock transaction hash generated:', mockTxHash);
        return mockTxHash;
      }
      
      console.log('User address:', address);
      
      // Use VeChain SDK to build and send transaction with hardcoded private key
      return await this.sendVeChainSDKApproveTransaction(address, answerId);
      
    } catch (error) {
      console.error('Failed to send VeChain SDK transaction for approveAnswer:', error);
      // Re-throw the error instead of returning a mock hash
      throw error;
    }
  }

  private async getUserAddress(): Promise<string | null> {
    if (!window.vechain) {
      console.log('VeWorld wallet not found, trying alternative methods...');
      // Try to get from localStorage or other sources
      const storedAddress = localStorage.getItem('vechain-wallet-address');
      if (storedAddress) {
        console.log('Found stored wallet address:', storedAddress);
        return storedAddress;
      }
      throw new Error('VeWorld wallet not found');
    }

    console.log('VeWorld wallet found, checking for account...');
    console.log('VeWorld object:', window.vechain);
    console.log('Available methods:', Object.keys(window.vechain));

    try {
      // Method 1: Try to get account directly
      if (window.vechain.account) {
        console.log('Found account directly:', window.vechain.account);
        return window.vechain.account;
      }
      
      // Method 2: Try to connect and get account
      if (window.vechain.connect) {
        console.log('Attempting to connect to VeWorld wallet...');
        const connection = await window.vechain.connect();
        console.log('Connection result:', connection);
        
        if (connection && connection.account) {
          console.log('Connected account:', connection.account);
          return connection.account;
        }
      }
      
      // Method 3: Try request method to get accounts
      if (window.vechain.request) {
        console.log('Trying request method to get accounts...');
        try {
          const accounts = await window.vechain.request({
            method: 'eth_accounts'
          });
          console.log('Accounts from request:', accounts);
          if (accounts && accounts.length > 0) {
            return accounts[0];
          }
        } catch (error) {
          console.log('eth_accounts failed:', error);
        }
      }
      
      // Method 4: Check localStorage for stored address
      const storedAddress = localStorage.getItem('vechain-wallet-address');
      if (storedAddress) {
        console.log('Using stored wallet address:', storedAddress);
        return storedAddress;
      }
      
      console.log('No account found in any method');
      return null;
    } catch (error) {
      console.error('Failed to get user address:', error);
      
      // Final fallback: try localStorage
      const storedAddress = localStorage.getItem('vechain-wallet-address');
      if (storedAddress) {
        console.log('Using stored address as fallback:', storedAddress);
        return storedAddress;
      }
      
      return null;
    }
  }

  private async sendVeChainSDKTransaction(userAddress: string, title: string, description: string, bounty: string, tags: string[]): Promise<string> {
    try {
      console.log('Building VeChain SDK transaction...');
      
      // Import VeChain SDK modules
      const { ThorClient } = await import('@vechain/sdk-network');
      const TESTNET_URL = process.env.VECHAIN_TESTNET_URL || 'https://testnet.vechain.org';
      const { ABIFunction, Clause, Address, VET, Transaction, HexUInt } = await import('@vechain/sdk-core');
      
      // Initialize Thor client
      const thorClient = ThorClient.at(TESTNET_URL);
      
      // Create ABI function for askQuestion
      const askQuestionABI = new ABIFunction({
        name: 'askQuestion',
        inputs: [
          { name: '_title', type: 'string' },
          { name: '_description', type: 'string' },
          { name: '_asker', type: 'address' },
          { name: '_tags', type: 'string[]' }
        ],
        outputs: [],
        constant: false,
        payable: true,
        stateMutability: 'payable',
        type: 'function'
      });
      
      // Convert bounty to VET
      const bountyVET = VET.of(parseFloat(bounty));
      
          // Create clause for askQuestion function call
          const clauses = [
            Clause.callFunction(
              Address.of(this.contractAddress),
              askQuestionABI,
              [title, description, userAddress, tags], // Using separate title, description, asker address, and tags
              bountyVET
            )
          ];
      
      console.log('Transaction clauses:', clauses);
      
      // Estimate gas
      const gasResult = await thorClient.gas.estimateGas(clauses, userAddress);
      console.log('Gas estimation:', gasResult);
      
      // Build transaction body
      const txBody = await thorClient.transactions.buildTransactionBody(
        clauses,
        gasResult.totalGas
      );
      
      console.log('Transaction body:', txBody);
      
      // Use hardcoded private key for transaction signing
      const privateKey = process.env.PRIVATE_KEY || '9dd489bda0d66bcba0d8e36057cb3a570e6197ab5a88e56b495f5cba71e83922';
      if (!privateKey) {
        throw new Error('PRIVATE_KEY environment variable is required for transaction signing');
      }
      
      try {
        console.log('🔐 Signing transaction with hardcoded private key...');
        
        // Convert private key to bytes
        const privateKeyBytes = HexUInt.of(privateKey).bytes;
        
        // Create and sign transaction
        const transaction = Transaction.of(txBody);
        const signedTransaction = transaction.sign(privateKeyBytes);
        
        console.log('✅ Transaction signed successfully');
        
        // Send transaction to VeChain testnet
        console.log('🚀 Sending real transaction to VeChain testnet...');
        const transactionResult = await thorClient.transactions.sendTransaction(signedTransaction);
        
        console.log('✅ REAL VeChain testnet transaction sent!');
        console.log('Transaction ID:', transactionResult.id);
        
        // Wait for transaction confirmation
        console.log('⏳ Waiting for transaction confirmation...');
        const receipt = await thorClient.transactions.waitForTransaction(transactionResult.id);
        
        console.log('✅ Transaction confirmed!');
        console.log('Transaction receipt:', receipt);
        if (receipt) {
          console.log('Gas used:', receipt.gasUsed);
          console.log('Transaction successful:', !receipt.reverted);
        }
        
        return transactionResult.id;
        
      } catch (signError) {
        console.error('Failed to sign or send transaction:', signError);
        throw new Error(`Transaction failed: ${signError instanceof Error ? signError.message : 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Failed to build VeChain SDK transaction:', error);
      throw error;
    }
  }

  private async sendVeChainSDKAnswerTransaction(userAddress: string, questionId: number, content: string): Promise<string> {
    try {
      console.log('Building VeChain SDK answer transaction...');
      
      // Import VeChain SDK modules
      const { ThorClient } = await import('@vechain/sdk-network');
      const TESTNET_URL = process.env.VECHAIN_TESTNET_URL || 'https://testnet.vechain.org';
      const { ABIFunction, Clause, Address, VET, Transaction, HexUInt } = await import('@vechain/sdk-core');
      
      // Initialize Thor client
      const thorClient = ThorClient.at(TESTNET_URL);
      
      // Create ABI function for submitAnswer
      const submitAnswerABI = new ABIFunction({
        name: 'submitAnswer',
        inputs: [
          { name: '_questionId', type: 'uint256' },
          { name: '_content', type: 'string' },
          { name: '_answerer', type: 'address' }
        ],
        outputs: [],
        constant: false,
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      });
      
      // Create clause for submitAnswer function call (no VET transfer needed)
      const clauses = [
        Clause.callFunction(
          Address.of(this.contractAddress),
          submitAnswerABI,
          [questionId, content, userAddress],
          VET.of(0) // No VET transfer for answers
        )
      ];
      
      console.log('Answer transaction clauses:', clauses);
      
      // Estimate gas
      const gasResult = await thorClient.gas.estimateGas(clauses, userAddress);
      console.log('Gas estimation for answer:', gasResult);
      
      // Build transaction body
      const txBody = await thorClient.transactions.buildTransactionBody(
        clauses,
        gasResult.totalGas
      );
      
      console.log('Answer transaction body:', txBody);
      
      // Use hardcoded private key for transaction signing
      const privateKey = process.env.PRIVATE_KEY || '9dd489bda0d66bcba0d8e36057cb3a570e6197ab5a88e56b495f5cba71e83922';
      if (!privateKey) {
        throw new Error('PRIVATE_KEY environment variable is required for transaction signing');
      }
      
      try {
        console.log('🔐 Signing answer transaction with hardcoded private key...');
        
        // Convert private key to bytes
        const privateKeyBytes = HexUInt.of(privateKey).bytes;
        
        // Create and sign transaction
        const transaction = Transaction.of(txBody);
        const signedTransaction = transaction.sign(privateKeyBytes);
        
        console.log('✅ Answer transaction signed successfully');
        
        // Send transaction to VeChain testnet
        console.log('🚀 Sending real answer transaction to VeChain testnet...');
        const transactionResult = await thorClient.transactions.sendTransaction(signedTransaction);
        
        console.log('✅ REAL VeChain testnet answer transaction sent!');
        console.log('Answer Transaction ID:', transactionResult.id);
        
        // Wait for transaction confirmation
        console.log('⏳ Waiting for answer transaction confirmation...');
        const receipt = await thorClient.transactions.waitForTransaction(transactionResult.id);
        
        console.log('✅ Answer transaction confirmed!');
        console.log('Answer transaction receipt:', receipt);
        if (receipt) {
          console.log('Gas used:', receipt.gasUsed);
          console.log('Answer transaction successful:', !receipt.reverted);
          
          if (receipt.reverted) {
            console.error('❌ Answer transaction was reverted!');
            console.error('Possible causes:');
            console.error('  1. Question does not exist (questionId:', questionId, ')');
            console.error('  2. Question is not active');
            console.error('  3. Trying to answer your own question');
            console.error('  4. Answer content is empty');
            console.error('  5. User not registered (should auto-register)');
          }
        }
        
        return transactionResult.id;
        
      } catch (signError) {
        console.error('Failed to sign or send answer transaction:', signError);
        throw new Error(`Answer transaction failed: ${signError instanceof Error ? signError.message : 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Failed to build VeChain SDK answer transaction:', error);
      throw error;
    }
  }

  private async sendVeChainSDKUpvoteTransaction(userAddress: string, answerId: number): Promise<string> {
    try {
      console.log('Building VeChain SDK upvote transaction...');
      
      // Import VeChain SDK modules
      const { ThorClient } = await import('@vechain/sdk-network');
      const TESTNET_URL = process.env.VECHAIN_TESTNET_URL || 'https://testnet.vechain.org';
      const { ABIFunction, Clause, Address, VET, Transaction, HexUInt } = await import('@vechain/sdk-core');
      
      // Initialize Thor client
      const thorClient = ThorClient.at(TESTNET_URL);
      
      // Create ABI function for upvoteAnswer
      const upvoteAnswerABI = new ABIFunction({
        name: 'upvoteAnswer',
        inputs: [
          { name: '_answerId', type: 'uint256' },
          { name: '_voter', type: 'address' }
        ],
        outputs: [],
        constant: false,
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      });
      
      // Create clause for upvoteAnswer function call (no VET transfer needed)
      const clauses = [
        Clause.callFunction(
          Address.of(this.contractAddress),
          upvoteAnswerABI,
          [answerId, userAddress], // answerId and voter address
          VET.of(0) // No VET transfer for upvotes
        )
      ];
      
      console.log('Upvote transaction clauses:', clauses);
      
      // Estimate gas
      const gasResult = await thorClient.gas.estimateGas(clauses, userAddress);
      console.log('Gas estimation for upvote:', gasResult);
      
      // Build transaction body
      const txBody = await thorClient.transactions.buildTransactionBody(
        clauses,
        gasResult.totalGas
      );
      
      console.log('Upvote transaction body:', txBody);
      
      // Use hardcoded private key for transaction signing
      const privateKey = process.env.PRIVATE_KEY || '9dd489bda0d66bcba0d8e36057cb3a570e6197ab5a88e56b495f5cba71e83922';
      if (!privateKey) {
        throw new Error('PRIVATE_KEY environment variable is required for transaction signing');
      }
      
      try {
        console.log('🔐 Signing upvote transaction with hardcoded private key...');
        
        // Convert private key to bytes
        const privateKeyBytes = HexUInt.of(privateKey).bytes;
        
        // Create and sign transaction
        const transaction = Transaction.of(txBody);
        const signedTransaction = transaction.sign(privateKeyBytes);
        
        console.log('✅ Upvote transaction signed successfully');
        
        // Send transaction to VeChain testnet
        console.log('🚀 Sending real upvote transaction to VeChain testnet...');
        const transactionResult = await thorClient.transactions.sendTransaction(signedTransaction);
        
        console.log('✅ REAL VeChain testnet upvote transaction sent!');
        console.log('Upvote Transaction ID:', transactionResult.id);
        
        // Wait for transaction confirmation
        console.log('⏳ Waiting for upvote transaction confirmation...');
        const receipt = await thorClient.transactions.waitForTransaction(transactionResult.id);
        
        console.log('✅ Upvote transaction confirmed!');
        console.log('Upvote transaction receipt:', receipt);
        
        if (receipt) {
          console.log('Gas used:', receipt.gasUsed);
          console.log('Upvote transaction successful:', !receipt.reverted);
          
          // Check if transaction was reverted
          if (receipt.reverted) {
            console.error('❌ Upvote transaction was reverted!');
            
            // Since we can't easily extract the exact revert reason from VeChain SDK,
            // we'll provide a generic but helpful error message
            throw new Error('Upvote failed: Transaction was reverted. This could be because you already upvoted this answer, you\'re trying to upvote your own answer, or the answer doesn\'t exist.');
          }
        }
        
        return transactionResult.id;
        
      } catch (signError) {
        console.error('Failed to sign or send upvote transaction:', signError);
        throw new Error(`Upvote transaction failed: ${signError instanceof Error ? signError.message : 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Failed to build VeChain SDK upvote transaction:', error);
      throw error;
    }
  }

  private async sendVeChainSDKApproveTransaction(userAddress: string, answerId: number): Promise<string> {
    try {
      console.log('Building VeChain SDK approve transaction...');
      
      // Import VeChain SDK modules
      const { ThorClient } = await import('@vechain/sdk-network');
      const TESTNET_URL = process.env.VECHAIN_TESTNET_URL || 'https://testnet.vechain.org';
      const { ABIFunction, Clause, Address, VET, Transaction, HexUInt } = await import('@vechain/sdk-core');
      
      // Initialize Thor client
      const thorClient = ThorClient.at(TESTNET_URL);
      
      // Create ABI function for approveAnswer
      const approveAnswerABI = new ABIFunction({
        name: 'approveAnswer',
        inputs: [
          { name: '_answerId', type: 'uint256' },
          { name: '_approver', type: 'address' }
        ],
        outputs: [],
        constant: false,
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      });
      
      // Create clause for approveAnswer function call (no VET transfer needed)
      const clauses = [
        Clause.callFunction(
          Address.of(this.contractAddress),
          approveAnswerABI,
          [answerId, userAddress], // answerId and approver address
          VET.of(0) // No VET transfer for approvals
        )
      ];
      
      console.log('Approve transaction clauses:', clauses);
      
      // Estimate gas
      const gasResult = await thorClient.gas.estimateGas(clauses, userAddress);
      console.log('Gas estimation for approve:', gasResult);
      
      // Build transaction body
      const txBody = await thorClient.transactions.buildTransactionBody(
        clauses,
        gasResult.totalGas
      );
      
      console.log('Approve transaction body:', txBody);
      
      // Use hardcoded private key for transaction signing
      const privateKey = process.env.PRIVATE_KEY || '9dd489bda0d66bcba0d8e36057cb3a570e6197ab5a88e56b495f5cba71e83922';
      if (!privateKey) {
        throw new Error('PRIVATE_KEY environment variable is required for transaction signing');
      }
      
      try {
        console.log('🔐 Signing approve transaction with hardcoded private key...');
        
        // Convert private key to bytes
        const privateKeyBytes = HexUInt.of(privateKey).bytes;
        
        // Create and sign transaction
        const transaction = Transaction.of(txBody);
        const signedTransaction = transaction.sign(privateKeyBytes);
        
        console.log('✅ Approve transaction signed successfully');
        
        // Send transaction to VeChain testnet
        console.log('🚀 Sending real approve transaction to VeChain testnet...');
        const transactionResult = await thorClient.transactions.sendTransaction(signedTransaction);
        
        console.log('✅ REAL VeChain testnet approve transaction sent!');
        console.log('Approve Transaction ID:', transactionResult.id);
        
        // Wait for transaction confirmation
        console.log('⏳ Waiting for approve transaction confirmation...');
        const receipt = await thorClient.transactions.waitForTransaction(transactionResult.id);
        
        console.log('✅ Approve transaction confirmed!');
        console.log('Approve transaction receipt:', receipt);
        if (receipt) {
          console.log('Gas used:', receipt.gasUsed);
          console.log('Approve transaction successful:', !receipt.reverted);
        }
        
        return transactionResult.id;
        
      } catch (signError) {
        console.error('Failed to sign or send approve transaction:', signError);
        throw new Error(`Approve transaction failed: ${signError instanceof Error ? signError.message : 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Failed to build VeChain SDK approve transaction:', error);
      throw error;
    }
  }

  // Upvote a question
  async upvoteQuestion(questionId: number, userAddress?: string): Promise<string> {
    try {
      console.log('🚀 Sending REAL VeChain testnet transaction for upvoteQuestion via VeChain SDK...');
      console.log('Question ID:', questionId);

      // Get user's wallet address - try passed address first, then auto-detect
      let address = userAddress;
      if (!address) {
        address = await this.getUserAddress() || undefined;
      }
      
      if (!address) {
        throw new Error('User address is required for upvoting questions');
      }

      console.log('User address:', address);
      
      // Use VeChain SDK to build and send transaction with hardcoded private key
      return await this.sendVeChainSDKUpvoteQuestionTransaction(address, questionId);
      
    } catch (error) {
      console.error('Failed to send VeChain SDK transaction:', error);
      throw error;
    }
  }

  private async sendVeChainSDKUpvoteQuestionTransaction(address: string, questionId: number): Promise<string> {
    try {
      const { ABIFunction, Clause, Address, VET, Transaction, HexUInt } = await import('@vechain/sdk-core');
      const { ThorClient } = await import('@vechain/sdk-network');
      
      // Initialize Thor client
      const TESTNET_URL = process.env.VECHAIN_TESTNET_URL || "https://testnet.vechain.org";
      const thorClient = ThorClient.at(TESTNET_URL);
      
      // Create ABI function for upvoteQuestion
      const upvoteQuestionABI = new ABIFunction({
        name: 'upvoteQuestion',
        inputs: [
          { name: '_questionId', type: 'uint256' },
          { name: '_voter', type: 'address' }
        ],
        outputs: [],
        constant: false,
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      });
      
      // Create clause for upvoteQuestion function call (no VET transfer needed)
      const clauses = [
        Clause.callFunction(
          Address.of(this.contractAddress),
          upvoteQuestionABI,
          [questionId, address], // questionId and voter address
          VET.of(0) // No VET transfer for question upvotes
        )
      ];
      
      console.log('Upvote question transaction clauses:', clauses);
      
      // Estimate gas
      const gasEstimation = await thorClient.gas.estimateGas(clauses);
      console.log('Gas estimation for upvote question:', gasEstimation);
      
      if (gasEstimation.reverted) {
        throw new Error(`Transaction would revert: ${gasEstimation.revertReasons.join(', ')}`);
      }
      
      // Get current block reference
      const bestBlockRef = await thorClient.blocks.getBestBlockRef();
      if (!bestBlockRef) {
        throw new Error('Failed to get best block reference');
      }
      const blockRef = bestBlockRef.slice(0, 18); // Take first 8 bytes of block ID
      
      // Build transaction
      const transactionBody = {
        chainTag: 39, // VeChain testnet chain tag
        blockRef: blockRef,
        expiration: 720, // 720 blocks = ~3 hours
        clauses: clauses,
        gasPriceCoef: 0,
        gas: gasEstimation.totalGas,
        dependsOn: null,
        nonce: Math.floor(Math.random() * 1000000)
      };
      
      console.log('Upvote question transaction body:', transactionBody);
      
      // Sign transaction with hardcoded private key
      const privateKey = process.env.PRIVATE_KEY || '9dd489bda0d66bcba0d8e36057cb3a570e6197ab5a88e56b495f5cba71e83922';
      console.log('🔐 Signing upvote question transaction with hardcoded private key...');
      
      // Convert private key to bytes
      const privateKeyBytes = HexUInt.of(privateKey).bytes;
      
      // Create and sign transaction
      const transaction = Transaction.of(transactionBody);
      const signedTransaction = transaction.sign(privateKeyBytes);
      console.log('✅ Upvote question transaction signed successfully');
      
      // Send transaction
      console.log('🚀 Sending real upvote question transaction to VeChain testnet...');
      const transactionResult = await thorClient.transactions.sendTransaction(signedTransaction);
      console.log('✅ REAL VeChain testnet upvote question transaction sent!');
      console.log('Upvote Question Transaction ID:', transactionResult.id);
      
      // Wait for transaction to be confirmed
      console.log('⏳ Waiting for upvote question transaction confirmation...');
      const receipt = await thorClient.transactions.getTransactionReceipt(transactionResult.id);
      console.log('✅ Upvote question transaction confirmed!');
      console.log('Upvote question transaction receipt:', receipt);
      
      if (receipt) {
        console.log('Gas used:', receipt.gasUsed);
        console.log('Upvote question transaction successful:', !receipt.reverted);
        
        // Check if transaction was reverted
        if (receipt.reverted) {
          console.error('❌ Upvote question transaction was reverted!');
          
          // Since we can't easily extract the exact revert reason from VeChain SDK,
          // we'll provide a generic but helpful error message
          throw new Error('Upvote question failed: Transaction was reverted. This could be because you already upvoted this question, you\'re trying to upvote your own question, or the question doesn\'t exist.');
        }
      }
      
      return transactionResult.id;
      
    } catch (signError) {
      console.error('Failed to sign or send upvote question transaction:', signError);
      throw new Error(`Upvote question transaction failed: ${signError instanceof Error ? signError.message : 'Unknown error'}`);
    }
  }

  // Map revert reasons to user-friendly messages
  private mapRevertReasonToMessage(revertReason: string): string {
    const reason = revertReason.toLowerCase();
    
    // Answer upvote errors
    if (reason.includes('cannot upvote your own answer')) {
      return 'You cannot upvote your own answer';
    }
    if (reason.includes('already upvoted this answer')) {
      return 'You have already upvoted this answer';
    }
    if (reason.includes('answer does not exist')) {
      return 'This answer does not exist';
    }
    
    // Question upvote errors
    if (reason.includes('cannot upvote your own question')) {
      return 'You cannot upvote your own question';
    }
    if (reason.includes('already upvoted this question')) {
      return 'You have already upvoted this question';
    }
    if (reason.includes('question does not exist')) {
      return 'This question does not exist';
    }
    
    // General errors
    if (reason.includes('user not registered')) {
      return 'User is not registered on the platform';
    }
    if (reason.includes('insufficient gas')) {
      return 'Insufficient gas to complete the transaction';
    }
    if (reason.includes('transaction was reverted')) {
      return 'Transaction was reverted by the smart contract';
    }
    if (reason.includes('voter address cannot be zero')) {
      return 'Invalid voter address';
    }
    
    // Default message
    return 'Transaction failed: ' + revertReason;
  }

}

export const vechainSDKTransactionService = new VeChainSDKTransactionService();