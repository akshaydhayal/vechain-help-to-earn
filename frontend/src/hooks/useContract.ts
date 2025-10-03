'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { getMainContract, getRewardSystemContract } from '@/lib/contracts'

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
  const [rewardContract, setRewardContract] = useState<ethers.Contract | null>(null)
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    totalRewards: 0
  })

  useEffect(() => {
    if (provider) {
      setMainContract(getMainContract(provider))
      setRewardContract(getRewardSystemContract(provider))
    }
  }, [provider])

  const getQuestion = async (questionId: number): Promise<Question | null> => {
    if (!mainContract) return null
    
    try {
      const question = await mainContract.getQuestion(questionId)
      return {
        id: Number(question.id),
        asker: question.asker,
        title: question.title,
        content: question.content,
        tags: question.tags,
        timestamp: Number(question.timestamp),
        bounty: question.bounty.toString(),
        isResolved: question.isResolved,
        approvedAnswer: question.approvedAnswer,
        totalAnswers: Number(question.totalAnswers)
      }
    } catch (error) {
      console.error('Error fetching question:', error)
      return null
    }
  }

  const getAnswer = async (answerId: number): Promise<Answer | null> => {
    if (!mainContract) return null
    
    try {
      const answer = await mainContract.getAnswer(answerId)
      return {
        id: Number(answer.id),
        questionId: Number(answer.questionId),
        author: answer.author,
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

  const getUserProfile = async (userAddress: string): Promise<UserProfile | null> => {
    if (!mainContract) return null
    
    try {
      const profile = await mainContract.getUserProfile(userAddress)
      return {
        questionsAsked: Number(profile.questionsAsked),
        answersGiven: Number(profile.answersGiven),
        reputation: Number(profile.reputation),
        isVerified: profile.isVerified
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
        totalUsers: Number(stats.totalUsers),
        totalQuestions: Number(stats.totalQuestions),
        totalAnswers: Number(stats.totalAnswers),
        totalRewards: Number(stats.totalRewards)
      })
    } catch (error) {
      console.error('Error fetching platform stats:', error)
    }
  }

  const getPendingRewards = async (userAddress: string): Promise<string> => {
    if (!rewardContract) return '0'
    
    try {
      const rewards = await rewardContract.getPendingRewards(userAddress)
      return rewards.toString()
    } catch (error) {
      console.error('Error fetching pending rewards:', error)
      return '0'
    }
  }

  return {
    mainContract,
    rewardContract,
    platformStats,
    getQuestion,
    getAnswer,
    getUserProfile,
    getPlatformStats,
    getPendingRewards
  }
}
