// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title VeChainQuoraMinimal
 * @dev Minimal version of VeChain Quora platform for testnet deployment
 * @notice This contract handles basic Q&A functionality with minimal gas requirements
 */
contract VeChainQuoraMinimal {
    
    // Basic structs
    struct Question {
        uint256 id;
        address asker;
        string title;
        string content;
        uint256 timestamp;
        uint256 bounty;
        bool isResolved;
    }
    
    struct Answer {
        uint256 id;
        uint256 questionId;
        address author;
        string content;
        uint256 timestamp;
        uint256 upvotes;
    }
    
    // State variables
    uint256 public questionCounter;
    uint256 public answerCounter;
    address public owner;
    bool public isActive;
    
    // Mappings
    mapping(uint256 => Question) public questions;
    mapping(uint256 => Answer) public answers;
    mapping(address => uint256) public userReputation;
    mapping(address => uint256[]) public userQuestions;
    mapping(address => uint256[]) public userAnswers;
    
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
        address indexed author
    );
    
    event AnswerUpvoted(
        uint256 indexed answerId,
        address indexed voter
    );
    
    event AnswerApproved(
        uint256 indexed questionId,
        uint256 indexed answerId,
        address indexed asker
    );
    
    constructor() {
        owner = msg.sender;
        isActive = true;
    }
    
    /**
     * @dev Ask a new question with bounty
     */
    function askQuestion(
        string memory title,
        string memory content,
        uint256 bounty
    ) external payable {
        require(isActive, "Platform is not active");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(content).length > 0, "Content cannot be empty");
        require(msg.value >= bounty, "Insufficient bounty");
        
        questionCounter++;
        uint256 questionId = questionCounter;
        
        questions[questionId] = Question({
            id: questionId,
            asker: msg.sender,
            title: title,
            content: content,
            timestamp: block.timestamp,
            bounty: bounty,
            isResolved: false
        });
        
        userQuestions[msg.sender].push(questionId);
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
        
        answerCounter++;
        uint256 answerId = answerCounter;
        
        answers[answerId] = Answer({
            id: answerId,
            questionId: questionId,
            author: msg.sender,
            content: content,
            timestamp: block.timestamp,
            upvotes: 0
        });
        
        userAnswers[msg.sender].push(answerId);
        userReputation[msg.sender] += 1; // Basic reputation for answering
        
        emit AnswerPosted(answerId, questionId, msg.sender);
    }
    
    /**
     * @dev Upvote an answer
     */
    function upvoteAnswer(uint256 answerId) external {
        require(isActive, "Platform is not active");
        require(answers[answerId].id != 0, "Answer does not exist");
        require(answers[answerId].author != msg.sender, "Cannot upvote own answer");
        
        answers[answerId].upvotes++;
        userReputation[answers[answerId].author] += 2; // Reputation for upvote
        
        emit AnswerUpvoted(answerId, msg.sender);
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
        userReputation[answers[answerId].author] += 10; // Big reward for approved answer
        
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
        uint256 timestamp,
        uint256 bounty,
        bool isResolved
    ) {
        Question storage q = questions[questionId];
        return (
            q.id,
            q.asker,
            q.title,
            q.content,
            q.timestamp,
            q.bounty,
            q.isResolved
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
        uint256 upvotes
    ) {
        Answer storage a = answers[answerId];
        return (
            a.id,
            a.questionId,
            a.author,
            a.content,
            a.timestamp,
            a.upvotes
        );
    }
    
    /**
     * @dev Get user reputation
     */
    function getUserReputation(address user) external view returns (uint256) {
        return userReputation[user];
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
        uint256 questions,
        uint256 answers,
        uint256 totalBounty
    ) {
        return (
            questionCounter,
            answerCounter,
            address(this).balance
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
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
