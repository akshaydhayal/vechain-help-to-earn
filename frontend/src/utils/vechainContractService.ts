'use client';

import { ABIContract } from "@vechain/sdk-core";
import { ThorClient } from "@vechain/sdk-network";
import { contractAbi } from './contractAbi.js';

export class VeChainContractService {
  private contractAddress: string;
  private thorClient: ThorClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private abi: ABIContract<any>;

  constructor() {
    this.contractAddress = '0xf331dc138fdc90633c3176b2a9a80e9d2b13a8e2';
    const testnetUrl = process.env.VECHAIN_TESTNET_URL || "https://testnet.vechain.org";
    this.thorClient = ThorClient.at(testnetUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.abi = new ABIContract(contractAbi as any);
    console.log('VeChain Contract Service initialized');
  }

  // Get platform statistics
  async getPlatformStats() {
    try {
      console.log('Fetching platform stats from contract...');
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress, 
        this.abi.getFunction("getPlatformStats"), 
        []
      );
      
      if (result.success && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [totalQuestions, totalAnswers, totalUsers, contractBalance] = result.result.plain as any[];
        return {
          totalQuestions: totalQuestions.toString(),
          totalAnswers: totalAnswers.toString(),
          totalUsers: totalUsers.toString(),
          contractBalance: (Number(contractBalance) / 1e18).toFixed(2) // Convert from Wei to VET
        };
      }
      throw new Error('Failed to fetch platform stats');
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return {
        totalQuestions: "0",
        totalAnswers: "0", 
        totalUsers: "0",
        contractBalance: "0"
      };
    }
  }

  // Get a specific question by ID
  async getQuestion(questionId: number) {
    try {
      console.log(`Fetching question ${questionId} from contract...`);
      
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction("getQuestion"),
        [questionId.toString()]
      );
      
      if (result.success && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [
          id,
          asker,
          title,
          description,
          bounty,
          hasApprovedAnswer,
          approvedAnswerId,
          upvotes,
          tags,
          timestamp
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] = result.result.plain as any[];
        
        const questionData = {
          id: Number(id),
          asker: asker,
          title: title,
          description: description,
          bounty: (Number(bounty) / 1e18).toFixed(2), // Convert from Wei to VET
          isActive: true, // All questions are active now (no isActive field in contract)
          hasApprovedAnswer: hasApprovedAnswer,
          approvedAnswerId: approvedAnswerId.toString(),
          upvotes: Number(upvotes),
          tags: tags || [], // Add tags field
          timestamp: Number(timestamp),
          replies: 2 // TODO: Implement actual replies count from contract
        };
        
        console.log(`📊 Fetched question ${questionId} from contract:`, questionData);
        return questionData;
      }
      
      throw new Error(`Question ${questionId} not found`);
      
    } catch (error) {
      console.error(`Error fetching question ${questionId}:`, error);
      throw error;
    }
  }

  // Get all questions
  async getAllQuestions() {
    try {
      console.log('Fetching all questions from contract...');
      
      // Get question counter
      const counterResult = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction("questionCounter"),
        []
      );
      
      if (!counterResult.success || !counterResult.result) {
        throw new Error('Failed to get question counter');
      }
      
      const questionCount = Number(counterResult.result.plain);
      console.log(`Found ${questionCount} questions`);
      
      const questions = [];
      
      // Fetch each question
      for (let i = 1; i <= questionCount; i++) {
        try {
          const questionResult = await this.thorClient.contracts.executeCall(
            this.contractAddress,
            this.abi.getFunction("getQuestion"),
            [i.toString()]
          );
          
          if (questionResult.success && questionResult.result) {
            const [
              id,
              asker,
              title,
              description,
              bounty,
              hasApprovedAnswer,
              approvedAnswerId,
              upvotes,
              tags,
              timestamp
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ] = questionResult.result.plain as any[];
            
            const questionData = {
              id: Number(id),
              asker: asker,
              title: title,
              description: description,
              bounty: (Number(bounty) / 1e18).toFixed(2), // Convert from Wei to VET
              isActive: true, // All questions are active now (no isActive field in contract)
              hasApprovedAnswer: hasApprovedAnswer,
              approvedAnswerId: approvedAnswerId.toString(),
              upvotes: Number(upvotes),
              tags: tags || [], // Add tags field
              timestamp: Number(timestamp),
              replies: 2 // TODO: Implement actual replies count from contract
            };
            
            console.log(`📊 Fetched question ${i} from contract:`, questionData);
            questions.push(questionData);
          }
        } catch (error) {
          console.error(`Error fetching question ${i}:`, error);
        }
      }
      
      console.log(`Successfully fetched ${questions.length} questions`);
      return questions;
      
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }

  // Get a specific answer by ID
  async getAnswer(answerId: number) {
    try {
      console.log(`Fetching answer ${answerId} from contract...`);
      
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction("getAnswer"),
        [answerId.toString()]
      );
      
      if (result.success && result.result) {
        const [
          id,
          questionId,
          answerer,
          content,
          upvotes,
          isApproved,
          timestamp
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] = result.result.plain as any[];
        
        return {
          id: Number(id),
          questionId: Number(questionId),
          answerer: answerer,
          content: content,
          upvotes: Number(upvotes),
          isApproved: isApproved,
          timestamp: Number(timestamp)
        };
      }
      
      throw new Error(`Answer ${answerId} not found`);
      
    } catch (error) {
      console.error(`Error fetching answer ${answerId}:`, error);
      throw error;
    }
  }

  // Get all answers
  async getAllAnswers() {
    try {
      console.log('Fetching all answers from contract...');
      
      // Get answer counter
      const counterResult = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction("answerCounter"),
        []
      );
      
      if (!counterResult.success || !counterResult.result) {
        throw new Error('Failed to get answer counter');
      }
      
      const answerCount = Number(counterResult.result.plain);
      console.log(`Found ${answerCount} answers`);
      
      const answers = [];
      
      // Fetch each answer
      for (let i = 1; i <= answerCount; i++) {
        try {
          const answerResult = await this.thorClient.contracts.executeCall(
            this.contractAddress,
            this.abi.getFunction("getAnswer"),
            [i.toString()]
          );
          
          if (answerResult.success && answerResult.result) {
            const [
              id,
              questionId,
              answerer,
              content,
              upvotes,
              isApproved,
              timestamp
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ] = answerResult.result.plain as any[];
            
            answers.push({
              id: Number(id),
              questionId: Number(questionId),
              answerer: answerer,
              content: content,
              upvotes: Number(upvotes),
              isApproved: isApproved,
              timestamp: Number(timestamp)
            });
          }
        } catch (error) {
          console.error(`Error fetching answer ${i}:`, error);
        }
      }
      
      console.log(`Successfully fetched ${answers.length} answers`);
      return answers;
      
    } catch (error) {
      console.error('Error fetching answers:', error);
      return [];
    }
  }

  // Get answers for a specific question
  async getQuestionAnswers(questionId: number) {
    try {
      console.log(`Fetching answers for question ${questionId}...`);
      
      const allAnswers = await this.getAllAnswers();
      const questionAnswers = allAnswers.filter(answer => answer.questionId === questionId);
      
      console.log(`Found ${questionAnswers.length} answers for question ${questionId}`);
      return questionAnswers;
      
    } catch (error) {
      console.error('Error fetching question answers:', error);
      return [];
    }
  }

  // Get user information
  async getUser(userAddress: string) {
    try {
      console.log(`Fetching user info for ${userAddress}...`);
      
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction("getUser"),
        [userAddress]
      );
      
      if (result.success && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [wallet, reputation, questionsAsked, answersGiven, answersApproved] = result.result.plain as any[];
        return {
          wallet: wallet,
          reputation: Number(reputation),
          questionsAsked: Number(questionsAsked),
          answersGiven: Number(answersGiven),
          answersApproved: Number(answersApproved)
        };
      }
      
      // Return default user if not found
      return {
        wallet: userAddress,
        reputation: 0,
        questionsAsked: 0,
        answersGiven: 0,
        answersApproved: 0
      };
      
    } catch (error) {
      console.error('Error fetching user info:', error);
      return {
        wallet: userAddress,
        reputation: 0,
        questionsAsked: 0,
        answersGiven: 0,
        answersApproved: 0
      };
    }
  }

  // Check if user has upvoted an answer
  async hasUserUpvoted(userAddress: string, answerId: number) {
    try {
      const result = await this.thorClient.contracts.executeCall(
        this.contractAddress,
        this.abi.getFunction("hasUpvoted"),
        [userAddress, answerId.toString()]
      );
      
      if (result.success && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return result.result.plain as any;
      }
      return false;
      
    } catch (error) {
      console.error('Error checking upvote status:', error);
      return false;
    }
  }
}

export const vechainContractService = new VeChainContractService();
