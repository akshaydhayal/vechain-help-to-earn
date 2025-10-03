import { ethers } from 'ethers'

// Contract addresses
export const CONTRACT_ADDRESSES = {
  MAIN: process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS!,
  QUESTION_MANAGER: process.env.NEXT_PUBLIC_QUESTION_MANAGER_ADDRESS!,
  REWARD_SYSTEM: process.env.NEXT_PUBLIC_REWARD_SYSTEM_ADDRESS!,
}

// Contract ABIs (simplified for frontend)
export const MAIN_CONTRACT_ABI = [
  "function askQuestion(string memory title, string memory content, string[] memory tags) external payable",
  "function postAnswer(uint256 questionId, string memory content) external",
  "function upvoteAnswer(uint256 answerId) external",
  "function downvoteAnswer(uint256 answerId) external", 
  "function approveAnswer(uint256 questionId, uint256 answerId) external",
  "function registerUser() external",
  "function getQuestion(uint256 questionId) external view returns (tuple(uint256 id, address asker, string title, string content, string[] tags, uint256 timestamp, uint256 bounty, bool isResolved, address approvedAnswer, uint256 totalAnswers))",
  "function getAnswer(uint256 answerId) external view returns (tuple(uint256 id, uint256 questionId, address author, string content, uint256 timestamp, uint256 upvotes, uint256 downvotes, bool isApproved))",
  "function getUserProfile(address user) external view returns (tuple(uint256 questionsAsked, uint256 answersGiven, uint256 reputation, bool isVerified))",
  "function getUserQuestions(address user) external view returns (uint256[] memory)",
  "function getUserAnswers(address user) external view returns (uint256[] memory)",
  "function getQuestionsByTag(string memory tag) external view returns (uint256[] memory)",
  "function getPlatformStats() external view returns (uint256 totalUsers, uint256 totalQuestions, uint256 totalAnswers, uint256 totalRewards)",
  "function claimRewards() external",
  "function getPendingRewards(address user) external view returns (uint256)",
  "event QuestionAsked(uint256 indexed questionId, address indexed asker, string title, uint256 bounty, uint256 timestamp)",
  "event AnswerPosted(uint256 indexed answerId, uint256 indexed questionId, address indexed author, uint256 timestamp)",
  "event AnswerUpvoted(uint256 indexed answerId, address indexed voter, uint256 newUpvotes)",
  "event AnswerDownvoted(uint256 indexed answerId, address indexed voter, uint256 newDownvotes)",
  "event AnswerApproved(uint256 indexed questionId, uint256 indexed answerId, address indexed approver)",
  "event UserRegistered(address indexed user)",
  "event ReputationUpdated(address indexed user, uint256 newReputation, uint256 change)"
]

export const REWARD_SYSTEM_ABI = [
  "function createRewardPool(uint256 epochId, uint256 amount) external",
  "function distributeRewards(address user, string memory activityType, uint256 engagementScore) external",
  "function claimRewards() external",
  "function getPendingRewards(address user) external view returns (uint256)",
  "function getPlatformStats() external view returns (uint256 totalUsers, uint256 totalQuestions, uint256 totalAnswers, uint256 totalRewardsDistributed)",
  "event RewardsDistributed(address indexed user, uint256 amount, string activityType, uint256 epoch)",
  "event RewardsClaimed(address indexed user, uint256 amount)"
]

// Contract instances
export function getMainContract(provider: ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESSES.MAIN, MAIN_CONTRACT_ABI, provider)
}

export function getRewardSystemContract(provider: ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESSES.REWARD_SYSTEM, REWARD_SYSTEM_ABI, provider)
}
