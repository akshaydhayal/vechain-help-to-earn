'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { getMainContract, getQuestionManagerContract, getRewardSystemContract } from '@/lib/contracts'

export interface Question {
  id: number
  asker: string
  title: string
  content: string
  tags: string[]
  timestamp: number
  bounty: string
  isResolved: boolean
  approvedAnswer: string
  totalAnswers: number
}

export interface Answer {
  id: number
  questionId: number
  author: string
  content: string
  timestamp: number
  upvotes: number
  downvotes: number
  isApproved: boolean
}

export interface UserProfile {
  questionsAsked: number
  answersGiven: number
  reputation: number
  isVerified: boolean
}

export function useContract(provider: ethers.Provider | null, signer: ethers.Signer | null) {
  const [mainContract, setMainContract] = useState<ethers.Contract | null>(null)
  const [questionManagerContract, setQuestionManagerContract] = useState<ethers.Contract | null>(null)
  const [rewardContract, setRewardContract] = useState<ethers.Contract | null>(null)
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    totalRewards: 0
  })

  useEffect(() => {
    if (provider) {
      setMainContract(getMainContract(provider, signer || undefined))
      setQuestionManagerContract(getQuestionManagerContract(provider, signer || undefined))
      setRewardContract(getRewardSystemContract(provider, signer || undefined))
    }
  }, [provider, signer])

  const getQuestion = async (questionId: number): Promise<Question | null> => {
    if (!questionManagerContract) return null
    
    try {
      const question = await questionManagerContract.getQuestion(questionId)
      return {
        id: questionId,
        asker: question.asker,
        title: question.title,
        content: question.content,
        tags: question.tags,
        timestamp: Number(question.timestamp),
        bounty: question.bounty.toString(),
        isResolved: question.isResolved,
        approvedAnswer: question.approvedAnswer,
        totalAnswers: 0 // Will be fetched separately
      }
    } catch (error) {
      console.error('Error fetching question:', error)
      return null
    }
  }

  const getAnswer = async (questionId: number, answerId: number): Promise<Answer | null> => {
    if (!questionManagerContract) return null
    
    try {
      const answer = await questionManagerContract.getAnswer(questionId, answerId)
      return {
        id: answerId,
        questionId: questionId,
        author: answer.answerer,
        content: answer.content,
        timestamp: Number(answer.timestamp),
        upvotes: Number(answer.upvotes),
        downvotes: Number(answer.downvotes),
        isApproved: answer.isApproved
      }
    } catch (error) {
      console.error('Error fetching answer:', error)
      return null
    }
  }

  const getQuestionAnswers = async (questionId: number): Promise<Answer[]> => {
    if (!questionManagerContract) return []
    
    try {
      const answerIds = await questionManagerContract.getQuestionAnswers(questionId)
      const answers: Answer[] = []
      
      for (const answerId of answerIds) {
        const answer = await getAnswer(questionId, Number(answerId))
        if (answer) answers.push(answer)
      }
      
      return answers
    } catch (error) {
      console.error('Error fetching question answers:', error)
      return []
    }
  }

  const getUserProfile = async (userAddress: string): Promise<UserProfile | null> => {
    if (!questionManagerContract) return null
    
    try {
      const reputation = await questionManagerContract.getUserReputation(userAddress)
      const userQuestions = await questionManagerContract.getUserQuestions(userAddress)
      const userAnswers = await questionManagerContract.getUserAnswers(userAddress)
      
      return {
        questionsAsked: userQuestions.length,
        answersGiven: userAnswers.length,
        reputation: Number(reputation),
        isVerified: false // Not implemented in current contract
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const getPlatformStats = async () => {
    if (!mainContract) return
    
    try {
      const stats = await mainContract.getPlatformStats()
      setPlatformStats({
        totalUsers: Number(stats.users),
        totalQuestions: Number(stats.questions),
        totalAnswers: Number(stats.answers),
        totalRewards: Number(stats.rewards)
      })
    } catch (error) {
      console.error('Error fetching platform stats:', error)
    }
  }

  const askQuestion = async (title: string, content: string, tags: string[], bounty: string) => {
    if (!questionManagerContract || !signer) throw new Error('Contract or signer not available')
    
    try {
      const bountyWei = ethers.parseEther(bounty)
      const tx = await questionManagerContract.askQuestion(title, content, tags, bountyWei, { value: bountyWei })
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error asking question:', error)
      throw error
    }
  }

  const answerQuestion = async (questionId: number, content: string) => {
    if (!questionManagerContract || !signer) throw new Error('Contract or signer not available')
    
    try {
      const tx = await questionManagerContract.answerQuestion(questionId, content)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error answering question:', error)
      throw error
    }
  }

  const approveAnswer = async (questionId: number, answerId: number) => {
    if (!questionManagerContract || !signer) throw new Error('Contract or signer not available')
    
    try {
      const tx = await questionManagerContract.approveAnswer(questionId, answerId)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error approving answer:', error)
      throw error
    }
  }

  const upvoteAnswer = async (questionId: number, answerId: number) => {
    if (!questionManagerContract || !signer) throw new Error('Contract or signer not available')
    
    try {
      const tx = await questionManagerContract.upvoteAnswer(questionId, answerId)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error upvoting answer:', error)
      throw error
    }
  }

  const downvoteAnswer = async (questionId: number, answerId: number) => {
    if (!questionManagerContract || !signer) throw new Error('Contract or signer not available')
    
    try {
      const tx = await questionManagerContract.downvoteAnswer(questionId, answerId)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error downvoting answer:', error)
      throw error
    }
  }

  const claimRewards = async () => {
    if (!rewardContract || !signer) throw new Error('Contract or signer not available')
    
    try {
      const tx = await rewardContract.claimRewards()
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error claiming rewards:', error)
      throw error
    }
  }

  const getPendingRewards = async (userAddress: string): Promise<string> => {
    if (!rewardContract) return '0'
    
    try {
      const rewards = await rewardContract.getUserRewards(userAddress)
      return rewards.toString()
    } catch (error) {
      console.error('Error fetching pending rewards:', error)
      return '0'
    }
  }

  return {
    mainContract,
    questionManagerContract,
    rewardContract,
    platformStats,
    getQuestion,
    getAnswer,
    getQuestionAnswers,
    getUserProfile,
    getPlatformStats,
    askQuestion,
    answerQuestion,
    approveAnswer,
    upvoteAnswer,
    downvoteAnswer,
    claimRewards,
    getPendingRewards
  }
}