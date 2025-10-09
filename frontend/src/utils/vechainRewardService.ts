import { ThorClient } from '@vechain/sdk-network';
import { ABIContract } from '@vechain/sdk-core';
import { contractAbi } from './contractAbi';
import { b3trTokenService } from './b3trTokenService';

export class VeChainRewardService {
  private contractAddress: string;
  private thorClient: ThorClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private abi: ABIContract<any>;

  constructor() {
    this.contractAddress = '0xab87673a820728a89867bdb5efa0e5aa0ff06a46';
    const testnetUrl = process.env.VECHAIN_TESTNET_URL || "https://testnet.vechain.org";
    this.thorClient = ThorClient.at(testnetUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.abi = new ABIContract(contractAbi as any);
    console.log('VeChain Reward Service initialized');
  }

  // Get VeBetterDAO balance for our app (using simulated B3TR service)
  async getVeBetterDAOBalance(): Promise<number> {
    try {
      console.log('🔍 VeChain Reward Service - Using simulated B3TR service for VeBetterDAO balance...');
      
      // Use B3TR token service directly for testnet compatibility
      const availableFunds = await b3trTokenService.getAvailableB3TRForApp();
      console.log(`📊 VeChain Reward Service - Simulated VeBetterDAO Balance: ${availableFunds} B3TR`);
      return availableFunds;
    } catch (error) {
      console.error('❌ VeChain Reward Service - Failed to fetch simulated VeBetterDAO balance:', error);
      return 100000; // 100K B3TR fallback
    }
  }

  // Get question reward breakdown
  async getQuestionRewardBreakdown(questionId: number): Promise<{
    questionPool: number;
    askerReward: number;
    firstAnswerReward: number;
    approvedAnswerReward: number;
    upvotedAnswersReward: number;
  }> {
    try {
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction('getQuestionRewardBreakdown'),
        [questionId]
      );

      if (result.success && result.result) {
        const [
          questionPool,
          askerReward,
          firstAnswerReward,
          approvedAnswerReward,
          upvotedAnswersReward
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] = result.result.plain as any[];

        return {
          questionPool: Number(questionPool) / 1e18,
          askerReward: Number(askerReward) / 1e18,
          firstAnswerReward: Number(firstAnswerReward) / 1e18,
          approvedAnswerReward: Number(approvedAnswerReward) / 1e18,
          upvotedAnswersReward: Number(upvotedAnswersReward) / 1e18
        };
      }
      return {
        questionPool: 0,
        askerReward: 0,
        firstAnswerReward: 0,
        approvedAnswerReward: 0,
        upvotedAnswersReward: 0
      };
    } catch (error) {
      console.error('Failed to fetch question reward breakdown:', error);
      return {
        questionPool: 0,
        askerReward: 0,
        firstAnswerReward: 0,
        approvedAnswerReward: 0,
        upvotedAnswersReward: 0
      };
    }
  }

  // Calculate question asker reward
  async calculateQuestionAskerReward(questionId: number, totalUpvotes: number): Promise<number> {
    try {
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction('calculateQuestionAskerReward'),
        [questionId, totalUpvotes]
      );

      if (result.success && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Number((result.result.plain as any)[0]) / 1e18;
      }
      return 0;
    } catch (error) {
      console.error('Failed to calculate question asker reward:', error);
      return 0;
    }
  }

  // Calculate upvoted answer reward
  async calculateUpvotedAnswerReward(questionId: number, totalUpvotes: number): Promise<number> {
    try {
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction('calculateUpvotedAnswerReward'),
        [questionId, totalUpvotes]
      );

      if (result.success && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Number((result.result.plain as any)[0]) / 1e18;
      }
      return 0;
    } catch (error) {
      console.error('Failed to calculate upvoted answer reward:', error);
      return 0;
    }
  }

  // Calculate first answer reward
  async calculateFirstAnswerReward(questionId: number): Promise<number> {
    try {
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction('calculateFirstAnswerReward'),
        [questionId]
      );

      if (result.success && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Number((result.result.plain as any)[0]) / 1e18;
      }
      return 0;
    } catch (error) {
      console.error('Failed to calculate first answer reward:', error);
      return 0;
    }
  }

  // Calculate approved answer reward
  async calculateApprovedAnswerReward(questionId: number): Promise<number> {
    try {
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction('calculateApprovedAnswerReward'),
        [questionId]
      );

      if (result.success && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Number((result.result.plain as any)[0]) / 1e18;
      }
      return 0;
    } catch (error) {
      console.error('Failed to calculate approved answer reward:', error);
      return 0;
    }
  }

  // Get user B3TR balance from B3TR token contract
  async getUserB3TRBalance(userAddress: string): Promise<number> {
    try {
      console.log(`🔍 VeChain Reward Service - Fetching B3TR balance for user: ${userAddress}`);
      
      // Use B3TR token service to get real balance
      const balance = await b3trTokenService.getUserB3TRBalance(userAddress);
      console.log(`📊 VeChain Reward Service - User B3TR Balance: ${balance} B3TR`);
      return balance;
    } catch (error) {
      console.error('❌ VeChain Reward Service - Failed to fetch user B3TR balance:', error);
      return 0;
    }
  }

  // Get total distributed rewards (for debugging)
  async getTotalDistributedRewards(): Promise<number> {
    try {
      console.log('🔍 Fetching total distributed rewards...');
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction('totalDistributedRewards'),
        []
      );

      if (result.success && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const distributed = Number((result.result.plain as any)[0]) / 1e18;
        console.log(`📊 Total Distributed Rewards: ${distributed} B3TR`);
        return distributed;
      }
      return 0;
    } catch (error) {
      console.error('❌ Failed to fetch total distributed rewards:', error);
      return 0;
    }
  }
}

export const vechainRewardService = new VeChainRewardService();
