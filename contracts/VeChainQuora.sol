// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./QuestionManager.sol";
import "./RewardSystem.sol";

/**
 * @title VeChainQuora
 * @dev Main contract that integrates QuestionManager and RewardSystem
 * @notice This is the main entry point for the VeChain Q&A platform
 */
contract VeChainQuora {
    
    // Contract instances
    QuestionManager public questionManager;
    RewardSystem public rewardSystem;
    
    // Platform statistics
    uint256 public totalUsers;
    uint256 public totalQuestions;
    uint256 public totalAnswers;
    uint256 public totalRewardsDistributed;
    
    // Platform settings
    address public owner;
    bool public isActive;
    
    // Events
    event PlatformInitialized(
        address indexed questionManager,
        address indexed rewardSystem,
        address indexed owner
    );
    
    event UserRegistered(
        address indexed user,
        uint256 timestamp
    );
    
    event PlatformStatsUpdated(
        uint256 totalUsers,
        uint256 totalQuestions,
        uint256 totalAnswers,
        uint256 totalRewards
    );
    
    constructor() {
        owner = msg.sender;
        isActive = true;
        
        // Deploy QuestionManager
        questionManager = new QuestionManager();
        
        // Deploy RewardSystem with QuestionManager address
        rewardSystem = new RewardSystem(address(questionManager));
        
        emit PlatformInitialized(
            address(questionManager),
            address(rewardSystem),
            owner
        );
    }
    
    /**
     * @dev Register a new user on the platform
     */
    function registerUser() external {
        require(isActive, "Platform is not active");
        
        // In a real implementation, you might want to check if user is already registered
        // For now, we'll just emit the event
        emit UserRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 users,
        uint256 questions,
        uint256 answers,
        uint256 rewards
    ) {
        return (
            totalUsers,
            totalQuestions,
            totalAnswers,
            totalRewardsDistributed
        );
    }
    
    /**
     * @dev Get contract addresses
     */
    function getContractAddresses() external view returns (
        address questionManagerAddr,
        address rewardSystemAddr
    ) {
        return (
            address(questionManager),
            address(rewardSystem)
        );
    }
    
    /**
     * @dev Toggle platform activity (only owner)
     */
    function togglePlatform() external {
        require(msg.sender == owner, "Only owner can toggle platform");
        isActive = !isActive;
    }
    
    /**
     * @dev Update platform statistics (only contracts)
     */
    function updateStats(
        uint256 users,
        uint256 questions,
        uint256 answers,
        uint256 rewards
    ) external {
        require(
            msg.sender == address(questionManager) || 
            msg.sender == address(rewardSystem),
            "Only authorized contracts can update stats"
        );
        
        totalUsers = users;
        totalQuestions = questions;
        totalAnswers = answers;
        totalRewardsDistributed = rewards;
        
        emit PlatformStatsUpdated(users, questions, answers, rewards);
    }
}
