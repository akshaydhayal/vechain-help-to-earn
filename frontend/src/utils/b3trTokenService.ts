import { ThorClient } from '@vechain/sdk-network';
import { ABIContract } from '@vechain/sdk-core';

// B3TR Token Contract ABI
const B3TR_TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export class B3TRTokenService {
  private thorClient: ThorClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private abi: ABIContract<any>;
  private contractAddress: string;

  constructor() {
    // Since we're on testnet and B3TR doesn't exist there, we'll simulate realistic balances
    this.contractAddress = '0x0000000000000000000000000000000000000000'; // Dummy address
    const testnetUrl = process.env.VECHAIN_TESTNET_URL || "https://testnet.vechain.org";
    this.thorClient = ThorClient.at(testnetUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.abi = new ABIContract(B3TR_TOKEN_ABI as any);
    console.log('B3TR Token Service initialized (Testnet Mode)');
    console.log('🔍 Using testnet URL:', testnetUrl);
    console.log('🔍 Note: B3TR token not available on testnet, using simulated balances');
  }

  // Get user B3TR balance (simulated for testnet)
  async getUserB3TRBalance(userAddress: string): Promise<number> {
    try {
      console.log(`🔍 Simulating B3TR balance for user: ${userAddress}`);
      
      // Generate a consistent balance based on user address
      // This ensures the same user always gets the same balance
      const addressHash = userAddress.slice(-8); // Last 8 characters
      const hashValue = parseInt(addressHash, 16);
      const balance = (hashValue % 1000) / 100; // 0.00 to 9.99 B3TR
      
      console.log(`📊 Address hash: ${addressHash}, Hash value: ${hashValue}`);
      console.log(`📊 Simulated User B3TR Balance: ${balance.toFixed(2)} B3TR`);
      return balance;
    } catch (error) {
      console.error('❌ Failed to simulate user B3TR balance:', error);
      return 0;
    }
  }

  // Get total B3TR supply (simulated for testnet)
  async getTotalB3TRSupply(): Promise<number> {
    try {
      console.log('🔍 Simulating total B3TR supply...');
      
      // Return a realistic total supply for demo purposes
      const totalSupply = 1000000; // 1M B3TR
      console.log(`📊 Simulated Total B3TR Supply: ${totalSupply.toLocaleString()} B3TR`);
      return totalSupply;
    } catch (error) {
      console.error('❌ Failed to simulate total B3TR supply:', error);
      return 1000000; // 1M B3TR fallback
    }
  }

  // Get available B3TR for our app (simulated for testnet)
  async getAvailableB3TRForApp(): Promise<number> {
    try {
      console.log('🔍 Simulating available B3TR for our app...');
      
      // Simulate available funds (10% of total supply for rewards)
      const totalSupply = await this.getTotalB3TRSupply();
      const availableFunds = totalSupply * 0.1; // 10% of total supply
      
      console.log(`📊 Total Supply: ${totalSupply.toLocaleString()} B3TR`);
      console.log(`📊 Available Funds (10%): ${availableFunds.toLocaleString()} B3TR`);
      return availableFunds;
    } catch (error) {
      console.error('❌ Failed to simulate available B3TR for app:', error);
      return 100000; // 100K B3TR fallback
    }
  }
}

export const b3trTokenService = new B3TRTokenService();
