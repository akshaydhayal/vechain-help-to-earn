// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title VeChainQuoraOptimized
 * @dev Optimized main contract for VeChain Quora platform
 * @notice This contract handles the main platform logic without deploying sub-contracts
 */
contract VeChainQuoraOptimized {
    
    // Structs
    struct Question {
        uint256 id;
        address asker;
        string title;
        string content;
        string[] tags;
        uint256 timestamp;
        uint256 bounty;
        bool isResolved;
        address approvedAnswer;
        uint256 totalAnswers;
    }
    
    struct Answer {
        uint256 id;
        uint256 questionId;
        address author;
        string content;
        uint256 timestamp;
        uint256 upvotes;
        bool isApproved;
    }
    
    struct UserProfile {
        address user;
        uint256 questionsAsked;
        uint256 answersGiven;
        uint256 totalUpvotes;
        uint256 reputation;
        bool isVerified;
    }
    
    // State variables
    uint256 public questionCounter;
    uint256 public answerCounter;
    
    // Mappings
    mapping(uint256 => Question) public questions;
    mapping(uint256 => Answer) public answers;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256[]) public userQuestions;
    mapping(address => uint256[]) public userAnswers;
    mapping(uint256 => mapping(address => bool)) public answerUpvoters;
    
    // Anti-farming mechanisms
    mapping(address => uint256) public lastQuestionTime;
    mapping(address => uint256) public lastAnswerTime;
    mapping(address => uint256) public dailyQuestions;
    mapping(address => uint256) public dailyAnswers;
    mapping(address => uint256) public lastDailyReset;
    
    // Platform settings
    address public owner;
    bool public isActive;
    
    // Constants
    uint256 public constant MIN_QUESTION_INTERVAL = 1 hours;
    uint256 public constant MIN_ANSWER_INTERVAL = 30 minutes;
    uint256 public constant MAX_DAILY_QUESTIONS = 10;
    uint256 public constant MAX_DAILY_ANSWERS = 50;
    uint256 public constant MIN_REPUTATION_TO_ASK = 10;
    
    // Events
    event QuestionAsked(
        uint256 indexed questionId,
        address indexed asker,
        string title,
        uint256 bounty
    );
    
    event AnswerPosted(
        uint256 indexed answerId,
        uint256 indexed questionId,
        address indexed author,
        string content
    );
    
    event AnswerUpvoted(
        uint256 indexed answerId,
        address indexed voter,
        address indexed author
    );
    
    event AnswerApproved(
        uint256 indexed questionId,
        uint256 indexed answerId,
        address indexed asker
    );
    
    event UserRegistered(
        address indexed user,
        uint256 timestamp
    );
    
    event ReputationUpdated(
        address indexed user,
        uint256 newReputation,
        uint256 change
    );
    
    constructor() {
        owner = msg.sender;
        isActive = true;
    }
    
    /**
     * @dev Register a new user on the platform
     */
    function registerUser() external {
        require(isActive, "Platform is not active");
        require(userProfiles[msg.sender].user == address(0), "User already registered");
        
        userProfiles[msg.sender] = UserProfile({
            user: msg.sender,
            questionsAsked: 0,
            answersGiven: 0,
            totalUpvotes: 0,
            reputation: 50, // Initial reputation
            isVerified: false
        });
        
        emit UserRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Ask a new question with bounty
     */
    function askQuestion(
        string memory title,
        string memory content,
        string[] memory tags,
        uint256 bounty
    ) external payable {
        require(isActive, "Platform is not active");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(content).length > 0, "Content cannot be empty");
        require(tags.length > 0, "At least one tag required");
        require(msg.value >= bounty, "Insufficient bounty");
        require(
            userProfiles[msg.sender].reputation >= MIN_REPUTATION_TO_ASK,
            "Insufficient reputation to ask questions"
        );
        require(
            block.timestamp - lastQuestionTime[msg.sender] >= MIN_QUESTION_INTERVAL,
            "Too soon to ask another question"
        );
        
        // Reset daily limits if needed
        _resetDailyLimits(msg.sender);
        require(
            dailyQuestions[msg.sender] < MAX_DAILY_QUESTIONS,
            "Daily question limit reached"
        );
        
        questionCounter++;
        uint256 questionId = questionCounter;
        
        questions[questionId] = Question({
            id: questionId,
            asker: msg.sender,
            title: title,
            content: content,
            tags: tags,
            timestamp: block.timestamp,
            bounty: bounty,
            isResolved: false,
            approvedAnswer: address(0),
            totalAnswers: 0
        });
        
        // Update user profile
        userProfiles[msg.sender].questionsAsked++;
        userQuestions[msg.sender].push(questionId);
        
        // Update anti-farming tracking
        lastQuestionTime[msg.sender] = block.timestamp;
        dailyQuestions[msg.sender]++;
        
        emit QuestionAsked(questionId, msg.sender, title, bounty);
    }
    
    /**
     * @dev Post an answer to a question
     */
    function postAnswer(
        uint256 questionId,
        string memory content
    ) external {
        require(isActive, "Platform is not active");
        require(questions[questionId].id != 0, "Question does not exist");
        require(!questions[questionId].isResolved, "Question is resolved");
        require(bytes(content).length > 0, "Answer cannot be empty");
        require(
            block.timestamp - lastAnswerTime[msg.sender] >= MIN_ANSWER_INTERVAL,
            "Too soon to post another answer"
        );
        
        // Reset daily limits if needed
        _resetDailyLimits(msg.sender);
        require(
            dailyAnswers[msg.sender] < MAX_DAILY_ANSWERS,
            "Daily answer limit reached"
        );
        
        answerCounter++;
        uint256 answerId = answerCounter;
        
        answers[answerId] = Answer({
            id: answerId,
            questionId: questionId,
            author: msg.sender,
            content: content,
            timestamp: block.timestamp,
            upvotes: 0,
            isApproved: false
        });
        
        // Update question
        questions[questionId].totalAnswers++;
        
        // Update user profile
        userProfiles[msg.sender].answersGiven++;
        userAnswers[msg.sender].push(answerId);
        
        // Update anti-farming tracking
        lastAnswerTime[msg.sender] = block.timestamp;
        dailyAnswers[msg.sender]++;
        
        // Award reputation for posting answer
        _updateReputation(msg.sender, 1);
        
        emit AnswerPosted(answerId, questionId, msg.sender, content);
    }
    
    /**
     * @dev Upvote an answer
     */
    function upvoteAnswer(uint256 answerId) external {
        require(isActive, "Platform is not active");
        require(answers[answerId].id != 0, "Answer does not exist");
        require(!answerUpvoters[answerId][msg.sender], "Already upvoted");
        require(answers[answerId].author != msg.sender, "Cannot upvote own answer");
        
        answers[answerId].upvotes++;
        answerUpvoters[answerId][msg.sender] = true;
        
        // Update author reputation
        userProfiles[answers[answerId].author].totalUpvotes++;
        _updateReputation(answers[answerId].author, 5);
        
        emit AnswerUpvoted(answerId, msg.sender, answers[answerId].author);
    }
    
    /**
     * @dev Approve the best answer (only by question asker)
     */
    function approveAnswer(uint256 questionId, uint256 answerId) external {
        require(isActive, "Platform is not active");
        require(questions[questionId].asker == msg.sender, "Only question asker can approve");
        require(questions[questionId].id != 0, "Question does not exist");
        require(answers[answerId].questionId == questionId, "Answer doesn't belong to question");
        require(!questions[questionId].isResolved, "Question already resolved");
        
        questions[questionId].isResolved = true;
        questions[questionId].approvedAnswer = answers[answerId].author;
        answers[answerId].isApproved = true;
        
        // Award reputation to approved answer author
        _updateReputation(answers[answerId].author, 20);
        
        // Transfer bounty to approved answer author
        payable(answers[answerId].author).transfer(questions[questionId].bounty);
        
        emit AnswerApproved(questionId, answerId, msg.sender);
    }
    
    /**
     * @dev Get question details
     */
    function getQuestion(uint256 questionId) external view returns (
        uint256 id,
        address asker,
        string memory title,
        string memory content,
        string[] memory tags,
        uint256 timestamp,
        uint256 bounty,
        bool isResolved,
        address approvedAnswer,
        uint256 totalAnswers
    ) {
        Question storage q = questions[questionId];
        return (
            q.id,
            q.asker,
            q.title,
            q.content,
            q.tags,
            q.timestamp,
            q.bounty,
            q.isResolved,
            q.approvedAnswer,
            q.totalAnswers
        );
    }
    
    /**
     * @dev Get answer details
     */
    function getAnswer(uint256 answerId) external view returns (
        uint256 id,
        uint256 questionId,
        address author,
        string memory content,
        uint256 timestamp,
        uint256 upvotes,
        bool isApproved
    ) {
        Answer storage a = answers[answerId];
        return (
            a.id,
            a.questionId,
            a.author,
            a.content,
            a.timestamp,
            a.upvotes,
            a.isApproved
        );
    }
    
    /**
     * @dev Get user profile
     */
    function getUserProfile(address user) external view returns (
        uint256 questionsAsked,
        uint256 answersGiven,
        uint256 totalUpvotes,
        uint256 reputation,
        bool isVerified
    ) {
        UserProfile storage profile = userProfiles[user];
        return (
            profile.questionsAsked,
            profile.answersGiven,
            profile.totalUpvotes,
            profile.reputation,
            profile.isVerified
        );
    }
    
    /**
     * @dev Get user's questions
     */
    function getUserQuestions(address user) external view returns (uint256[] memory) {
        return userQuestions[user];
    }
    
    /**
     * @dev Get user's answers
     */
    function getUserAnswers(address user) external view returns (uint256[] memory) {
        return userAnswers[user];
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
            questionCounter, // Using question counter as proxy for users
            questionCounter,
            answerCounter,
            0 // Placeholder for rewards
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
     * @dev Set user verification status (only owner)
     */
    function setUserVerified(address user, bool status) external {
        require(msg.sender == owner, "Only owner can set verification");
        userProfiles[user].isVerified = status;
    }
    
    /**
     * @dev Internal function to update user reputation
     */
    function _updateReputation(address user, int256 change) internal {
        if (change > 0) {
            userProfiles[user].reputation += uint256(change);
        } else {
            if (userProfiles[user].reputation >= uint256(-change)) {
                userProfiles[user].reputation -= uint256(-change);
            } else {
                userProfiles[user].reputation = 0;
            }
        }
        emit ReputationUpdated(
            user,
            userProfiles[user].reputation,
            uint256(change)
        );
    }
    
    /**
     * @dev Internal function to reset daily limits
     */
    function _resetDailyLimits(address user) internal {
        if (block.timestamp - lastDailyReset[user] >= 1 days) {
            dailyQuestions[user] = 0;
            dailyAnswers[user] = 0;
            lastDailyReset[user] = block.timestamp;
        }
    }
}
