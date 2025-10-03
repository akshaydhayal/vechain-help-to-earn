import { ethers } from 'ethers'

// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
  MAIN: '0x75aafb652d9105fec6967e194bf75532b115b506',
  QUESTION_MANAGER: '0x3EC82Aa279B4caa04268994e86cEf77F0D967c77',
  REWARD_SYSTEM: '0xde1a108f7a2421066daa49FE66A706A225210d6a',
}

// Main VeChain Quora Contract ABI
export const MAIN_CONTRACT_ABI = [
  // Platform stats
  "function getPlatformStats() external view returns (uint256 users, uint256 questions, uint256 answers, uint256 rewards)",
  "function getContractAddresses() external view returns (address questionManagerAddr, address rewardSystemAddr)",
  
  // User management
  "function registerUser() external",
  
  // Platform control
  "function togglePlatform() external",
  
  // Events
  "event PlatformStatsUpdated(uint256 totalUsers, uint256 totalQuestions, uint256 totalAnswers, uint256 totalRewards)",
  "event UserRegistered(address indexed user, uint256 timestamp)"
]

// Question Manager Contract ABI
export const QUESTION_MANAGER_ABI = [
  // Question management
  "function askQuestion(string memory title, string memory content, string[] memory tags, uint256 bounty) external payable returns (uint256 questionId)",
  "function answerQuestion(uint256 questionId, string memory content) external returns (uint256 answerId)",
  "function approveAnswer(uint256 questionId, uint256 answerId) external",
  "function upvoteAnswer(uint256 questionId, uint256 answerId) external",
  "function downvoteAnswer(uint256 questionId, uint256 answerId) external",
  
  // Getters
  "function getQuestion(uint256 questionId) external view returns (address asker, string memory title, string memory content, string[] memory tags, uint256 bounty, bool isResolved, address approvedAnswer, uint256 timestamp)",
  "function getAnswer(uint256 questionId, uint256 answerId) external view returns (address answerer, string memory content, uint256 upvotes, uint256 downvotes, bool isApproved, uint256 timestamp)",
  "function getQuestionAnswers(uint256 questionId) external view returns (uint256[] memory answerIds)",
  "function getTotalQuestions() external view returns (uint256)",
  "function getTotalAnswers() external view returns (uint256)",
  
  // User stats
  "function getUserQuestions(address user) external view returns (uint256[] memory questionIds)",
  "function getUserAnswers(address user) external view returns (uint256[] memory answerIds)",
  "function getUserReputation(address user) external view returns (uint256)",
  
  // Events
  "event QuestionAsked(uint256 indexed questionId, address indexed asker, string title, uint256 bounty)",
  "event QuestionAnswered(uint256 indexed questionId, uint256 indexed answerId, address indexed answerer)",
  "event AnswerApproved(uint256 indexed questionId, uint256 indexed answerId, address indexed approver)",
  "event AnswerUpvoted(uint256 indexed questionId, uint256 indexed answerId, address indexed voter)",
  "event AnswerDownvoted(uint256 indexed questionId, uint256 indexed answerId, address indexed voter)"
]

// Reward System Contract ABI
export const REWARD_SYSTEM_ABI = [
  // Reward management
  "function distributeRewards(uint256 questionId, uint256 answerId) external",
  "function claimRewards() external",
  "function getUserRewards(address user) external view returns (uint256)",
  
  // Anti-farming
  "function checkAntiFarming(address user) external view returns (bool)",
  "function reportFarming(address user) external",
  
  // Events
  "event RewardsDistributed(address indexed recipient, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 amount)"
]

// Contract instances
export function getMainContract(provider: ethers.Provider, signer?: ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESSES.MAIN, MAIN_CONTRACT_ABI, signer || provider)
}

export function getQuestionManagerContract(provider: ethers.Provider, signer?: ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESSES.QUESTION_MANAGER, QUESTION_MANAGER_ABI, signer || provider)
}

export function getRewardSystemContract(provider: ethers.Provider, signer?: ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESSES.REWARD_SYSTEM, REWARD_SYSTEM_ABI, signer || provider)
}