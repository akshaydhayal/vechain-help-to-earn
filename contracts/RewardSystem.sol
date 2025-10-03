// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./QuestionManager.sol";

/**
 * @title RewardSystem
 * @dev Handles B3TR token rewards distribution based on user engagement and quality
 * @notice Integrates with VeBetter DAO for X-to-Earn rewards
 */
contract RewardSystem is Ownable, ReentrancyGuard {
    
    // Interfaces
    QuestionManager public questionManager;
    
    // Reward structures
    struct RewardPool {
        uint256 totalAllocated; // Total B3TR allocated to this pool
        uint256 distributed; // Amount already distributed
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }
    
    struct UserReward {
        address user;
        uint256 pendingRewards;
        uint256 totalEarned;
        uint256 lastClaimTime;
        uint256 reputationMultiplier;
    }
    
    // State variables
    mapping(uint256 => RewardPool) public rewardPools;
    mapping(address => UserReward) public userRewards;
    mapping(address => uint256) public userEngagementScore;
    
    uint256 public currentPoolId;
    uint256 public constant REWARD_CYCLE_DURATION = 7 days;
    uint256 public constant MIN_REPUTATION_FOR_REWARDS = 50;
    
    // Reward multipliers
    uint256 public constant APPROVED_ANSWER_MULTIPLIER = 300; // 3x for approved answers
    uint256 public constant HIGH_ENGAGEMENT_MULTIPLIER = 200; // 2x for high engagement
    uint256 public constant VERIFIED_USER_MULTIPLIER = 150; // 1.5x for verified users
    uint256 public constant BASE_REWARD = 100; // Base reward units
    
    // Events
    event RewardPoolCreated(
        uint256 indexed poolId,
        uint256 totalAllocated,
        uint256 startTime,
        uint256 endTime
    );
    
    event RewardsDistributed(
        address indexed user,
        uint256 amount,
        uint256 poolId,
        string reason
    );
    
    event RewardsClaimed(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    
    event EngagementScoreUpdated(
        address indexed user,
        uint256 newScore,
        uint256 change
    );
    
    constructor(address _questionManager) Ownable() {
        questionManager = QuestionManager(_questionManager);
    }
    
    /**
     * @dev Create a new reward pool (called by VeBetter DAO)
     * @param totalAllocated Total B3TR tokens allocated for this pool
     */
    function createRewardPool(uint256 totalAllocated) external onlyOwner {
        currentPoolId++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + REWARD_CYCLE_DURATION;
        
        rewardPools[currentPoolId] = RewardPool({
            totalAllocated: totalAllocated,
            distributed: 0,
            startTime: startTime,
            endTime: endTime,
            isActive: true
        });
        
        emit RewardPoolCreated(currentPoolId, totalAllocated, startTime, endTime);
    }
    
    /**
     * @dev Calculate and distribute rewards for a user's activity
     * @param user User address
     * @param activityType Type of activity (1: approved answer, 2: high engagement, 3: regular activity)
     * @param engagementScore User's engagement score
     */
    function distributeRewards(
        address user,
        uint256 activityType,
        uint256 engagementScore
    ) external {
        require(
            msg.sender == address(questionManager) || msg.sender == owner(),
            "Only question manager or owner can distribute rewards"
        );
        
        RewardPool storage pool = rewardPools[currentPoolId];
        require(pool.isActive, "No active reward pool");
        require(block.timestamp <= pool.endTime, "Reward pool expired");
        
        // Check if user has minimum reputation
        (, , , uint256 reputation, , ) = questionManager.getUserProfile(user);
        require(reputation >= MIN_REPUTATION_FOR_REWARDS, "Insufficient reputation for rewards");
        
        uint256 baseReward = BASE_REWARD;
        uint256 multiplier = 100; // Base multiplier
        
        // Apply multipliers based on activity type
        if (activityType == 1) {
            multiplier = APPROVED_ANSWER_MULTIPLIER;
        } else if (activityType == 2) {
            multiplier = HIGH_ENGAGEMENT_MULTIPLIER;
        }
        
        // Apply verified user multiplier
        (, , , , bool isVerified, ) = questionManager.getUserProfile(user);
        if (isVerified) {
            multiplier = (multiplier * VERIFIED_USER_MULTIPLIER) / 100;
        }
        
        // Calculate final reward
        uint256 finalReward = (baseReward * multiplier * engagementScore) / 10000;
        
        // Ensure we don't exceed pool allocation
        require(pool.distributed + finalReward <= pool.totalAllocated, "Reward pool exhausted");
        
        // Update user rewards
        userRewards[user].pendingRewards += finalReward;
        userRewards[user].totalEarned += finalReward;
        userRewards[user].reputationMultiplier = multiplier;
        
        // Update pool
        pool.distributed += finalReward;
        
        // Update engagement score
        userEngagementScore[user] += engagementScore;
        
        emit RewardsDistributed(user, finalReward, currentPoolId, "Activity reward");
        emit EngagementScoreUpdated(user, userEngagementScore[user], engagementScore);
    }
    
    /**
     * @dev Claim pending rewards
     */
    function claimRewards() external nonReentrant {
        UserReward storage userReward = userRewards[msg.sender];
        require(userReward.pendingRewards > 0, "No pending rewards");
        
        uint256 claimAmount = userReward.pendingRewards;
        userReward.pendingRewards = 0;
        userReward.lastClaimTime = block.timestamp;
        
        // In a real implementation, this would transfer B3TR tokens
        // For now, we'll just emit the event
        emit RewardsClaimed(msg.sender, claimAmount, block.timestamp);
    }
    
    /**
     * @dev Get user's reward information
     * @param user User address
     */
    function getUserRewardInfo(address user) external view returns (
        uint256 pendingRewards,
        uint256 totalEarned,
        uint256 lastClaimTime,
        uint256 engagementScore,
        uint256 reputationMultiplier
    ) {
        UserReward storage userReward = userRewards[user];
        return (
            userReward.pendingRewards,
            userReward.totalEarned,
            userReward.lastClaimTime,
            userEngagementScore[user],
            userReward.reputationMultiplier
        );
    }
    
    /**
     * @dev Get current reward pool information
     */
    function getCurrentRewardPool() external view returns (
        uint256 poolId,
        uint256 totalAllocated,
        uint256 distributed,
        uint256 remaining,
        uint256 startTime,
        uint256 endTime,
        bool isActive
    ) {
        RewardPool storage pool = rewardPools[currentPoolId];
        return (
            currentPoolId,
            pool.totalAllocated,
            pool.distributed,
            pool.totalAllocated - pool.distributed,
            pool.startTime,
            pool.endTime,
            pool.isActive
        );
    }
    
    /**
     * @dev Calculate engagement score for a user
     * @param user User address
     */
    function calculateEngagementScore(address user) external view returns (uint256) {
        (, , uint256 totalUpvotes, uint256 reputation, , ) = questionManager.getUserProfile(user);
        
        // Engagement score based on upvotes and reputation
        uint256 score = (totalUpvotes * 10) + (reputation * 5);
        
        // Bonus for recent activity
        (, , , , , uint256 lastActivity) = questionManager.getUserProfile(user);
        if (block.timestamp - lastActivity < 1 days) {
            score += 50; // Recent activity bonus
        }
        
        return score;
    }
    
    /**
     * @dev Get leaderboard of top users by engagement
     * @param limit Number of top users to return
     */
    function getTopUsers(uint256 limit) external view returns (
        address[] memory users,
        uint256[] memory scores,
        uint256[] memory rewards
    ) {
        // This is a simplified implementation
        // In a real scenario, you'd need to maintain a sorted list
        // or use an off-chain service for complex queries
        
        address[] memory topUsers = new address[](limit);
        uint256[] memory topScores = new uint256[](limit);
        uint256[] memory topRewards = new uint256[](limit);
        
        // For now, return empty arrays
        // In production, implement proper sorting algorithm
        return (topUsers, topScores, topRewards);
    }
    
    /**
     * @dev Update question manager address (only owner)
     * @param newQuestionManager New question manager address
     */
    function updateQuestionManager(address newQuestionManager) external onlyOwner {
        questionManager = QuestionManager(newQuestionManager);
    }
    
    /**
     * @dev Emergency pause (only owner)
     */
    function pauseRewards() external onlyOwner {
        rewardPools[currentPoolId].isActive = false;
    }
    
    /**
     * @dev Resume rewards (only owner)
     */
    function resumeRewards() external onlyOwner {
        rewardPools[currentPoolId].isActive = true;
    }
}
