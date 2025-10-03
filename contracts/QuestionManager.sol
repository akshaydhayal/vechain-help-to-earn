// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title QuestionManager
 * @dev Manages questions, answers, and engagement on the VeChain Q&A platform
 * @notice This contract handles the core Q&A functionality with anti-farming mechanisms
 */
contract QuestionManager is Ownable, ReentrancyGuard {
    
    // Structs
    struct Question {
        uint256 id;
        address asker;
        string title;
        string content;
        string[] tags;
        uint256 timestamp;
        uint256 bounty; // VET bounty offered by asker
        bool isResolved;
        address approvedAnswer; // Best answer approved by asker
        uint256 totalAnswers;
        uint256 totalUpvotes;
    }
    
    struct Answer {
        uint256 id;
        uint256 questionId;
        address author;
        string content;
        uint256 timestamp;
        uint256 upvotes;
        uint256 downvotes;
        bool isApproved;
        mapping(address => bool) upvoters;
        mapping(address => bool) downvoters;
    }
    
    struct UserProfile {
        address user;
        uint256 questionsAsked;
        uint256 answersGiven;
        uint256 totalUpvotes;
        uint256 reputation;
        bool isVerified;
        uint256 lastActivity;
    }
    
    // State variables
    uint256 public questionCounter;
    uint256 public answerCounter;
    uint256 public totalBountyPool;
    
    // Mappings
    mapping(uint256 => Question) public questions;
    mapping(uint256 => Answer) public answers;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256[]) public userQuestions;
    mapping(address => uint256[]) public userAnswers;
    mapping(string => uint256[]) public questionsByTag;
    
    // Anti-farming mechanisms
    mapping(address => uint256) public lastQuestionTime;
    mapping(address => uint256) public lastAnswerTime;
    mapping(address => uint256) public dailyQuestions;
    mapping(address => uint256) public dailyAnswers;
    mapping(uint256 => uint256) public lastDailyReset;
    
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
        string[] tags,
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
    
    event ReputationUpdated(
        address indexed user,
        uint256 newReputation,
        uint256 change
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Ask a new question with bounty
     * @param title Question title
     * @param content Question content
     * @param tags Array of tags
     * @param bounty VET bounty for best answer
     */
    function askQuestion(
        string memory title,
        string memory content,
        string[] memory tags,
        uint256 bounty
    ) external payable nonReentrant {
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
        require(
            dailyQuestions[msg.sender] < MAX_DAILY_QUESTIONS,
            "Daily question limit reached"
        );
        
        // Reset daily counters if new day
        if (block.timestamp - lastDailyReset[msg.sender] >= 1 days) {
            dailyQuestions[msg.sender] = 0;
            dailyAnswers[msg.sender] = 0;
            lastDailyReset[msg.sender] = block.timestamp;
        }
        
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
            totalAnswers: 0,
            totalUpvotes: 0
        });
        
        // Update user profile
        userProfiles[msg.sender].questionsAsked++;
        userProfiles[msg.sender].lastActivity = block.timestamp;
        userQuestions[msg.sender].push(questionId);
        
        // Update tag mappings
        for (uint256 i = 0; i < tags.length; i++) {
            questionsByTag[tags[i]].push(questionId);
        }
        
        // Update anti-farming tracking
        lastQuestionTime[msg.sender] = block.timestamp;
        dailyQuestions[msg.sender]++;
        totalBountyPool += bounty;
        
        emit QuestionAsked(questionId, msg.sender, title, tags, bounty);
    }
    
    /**
     * @dev Post an answer to a question
     * @param questionId ID of the question
     * @param content Answer content
     */
    function postAnswer(
        uint256 questionId,
        string memory content
    ) external nonReentrant {
        require(questions[questionId].id != 0, "Question does not exist");
        require(!questions[questionId].isResolved, "Question is resolved");
        require(bytes(content).length > 0, "Answer cannot be empty");
        require(
            block.timestamp - lastAnswerTime[msg.sender] >= MIN_ANSWER_INTERVAL,
            "Too soon to post another answer"
        );
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
            downvotes: 0,
            isApproved: false
        });
        
        // Update question
        questions[questionId].totalAnswers++;
        
        // Update user profile
        userProfiles[msg.sender].answersGiven++;
        userProfiles[msg.sender].lastActivity = block.timestamp;
        userAnswers[msg.sender].push(answerId);
        
        // Update anti-farming tracking
        lastAnswerTime[msg.sender] = block.timestamp;
        dailyAnswers[msg.sender]++;
        
        emit AnswerPosted(answerId, questionId, msg.sender, content);
    }
    
    /**
     * @dev Upvote an answer
     * @param answerId ID of the answer
     */
    function upvoteAnswer(uint256 answerId) external {
        require(answers[answerId].id != 0, "Answer does not exist");
        require(!answers[answerId].upvoters[msg.sender], "Already upvoted");
        require(answers[answerId].author != msg.sender, "Cannot upvote own answer");
        
        answers[answerId].upvotes++;
        answers[answerId].upvoters[msg.sender] = true;
        
        // Update question total upvotes
        questions[answers[answerId].questionId].totalUpvotes++;
        
        // Update author reputation
        userProfiles[answers[answerId].author].totalUpvotes++;
        userProfiles[answers[answerId].author].reputation += 5;
        
        emit AnswerUpvoted(answerId, msg.sender, answers[answerId].author);
        emit ReputationUpdated(
            answers[answerId].author,
            userProfiles[answers[answerId].author].reputation,
            5
        );
    }
    
    /**
     * @dev Approve the best answer (only by question asker)
     * @param questionId ID of the question
     * @param answerId ID of the answer to approve
     */
    function approveAnswer(uint256 questionId, uint256 answerId) external {
        require(questions[questionId].asker == msg.sender, "Only question asker can approve");
        require(questions[questionId].id != 0, "Question does not exist");
        require(answers[answerId].questionId == questionId, "Answer doesn't belong to question");
        require(!questions[questionId].isResolved, "Question already resolved");
        
        questions[questionId].isResolved = true;
        questions[questionId].approvedAnswer = answers[answerId].author;
        answers[answerId].isApproved = true;
        
        // Award reputation to approved answer author
        userProfiles[answers[answerId].author].reputation += 20;
        
        emit AnswerApproved(questionId, answerId, msg.sender);
        emit ReputationUpdated(
            answers[answerId].author,
            userProfiles[answers[answerId].author].reputation,
            20
        );
    }
    
    /**
     * @dev Get question details
     * @param questionId ID of the question
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
        uint256 totalAnswers,
        uint256 totalUpvotes
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
            q.totalAnswers,
            q.totalUpvotes
        );
    }
    
    /**
     * @dev Get answer details
     * @param answerId ID of the answer
     */
    function getAnswer(uint256 answerId) external view returns (
        uint256 id,
        uint256 questionId,
        address author,
        string memory content,
        uint256 timestamp,
        uint256 upvotes,
        uint256 downvotes,
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
            a.downvotes,
            a.isApproved
        );
    }
    
    /**
     * @dev Get user profile
     * @param user User address
     */
    function getUserProfile(address user) external view returns (
        uint256 questionsAsked,
        uint256 answersGiven,
        uint256 totalUpvotes,
        uint256 reputation,
        bool isVerified,
        uint256 lastActivity
    ) {
        UserProfile storage profile = userProfiles[user];
        return (
            profile.questionsAsked,
            profile.answersGiven,
            profile.totalUpvotes,
            profile.reputation,
            profile.isVerified,
            profile.lastActivity
        );
    }
    
    /**
     * @dev Get questions by tag
     * @param tag Tag to search for
     */
    function getQuestionsByTag(string memory tag) external view returns (uint256[] memory) {
        return questionsByTag[tag];
    }
    
    /**
     * @dev Get user's questions
     * @param user User address
     */
    function getUserQuestions(address user) external view returns (uint256[] memory) {
        return userQuestions[user];
    }
    
    /**
     * @dev Get user's answers
     * @param user User address
     */
    function getUserAnswers(address user) external view returns (uint256[] memory) {
        return userAnswers[user];
    }
    
    /**
     * @dev Verify a user (only owner)
     * @param user User to verify
     */
    function verifyUser(address user) external onlyOwner {
        userProfiles[user].isVerified = true;
    }
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
