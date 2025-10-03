// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title VeChainQuoraUltraMinimal
 * @dev Ultra-minimal Q&A contract for testnet deployment
 */
contract VeChainQuoraUltraMinimal {
    
    struct Question {
        uint256 id;
        address asker;
        string title;
        uint256 timestamp;
        uint256 bounty;
    }
    
    struct Answer {
        uint256 id;
        uint256 questionId;
        address author;
        string content;
        uint256 timestamp;
    }
    
    uint256 public questionCounter;
    uint256 public answerCounter;
    address public owner;
    
    mapping(uint256 => Question) public questions;
    mapping(uint256 => Answer) public answers;
    mapping(address => uint256) public reputation;
    
    event QuestionAsked(uint256 indexed questionId, address indexed asker, string title);
    event AnswerPosted(uint256 indexed answerId, uint256 indexed questionId, address indexed author);
    
    constructor() {
        owner = msg.sender;
    }
    
    function askQuestion(string memory title, uint256 bounty) external payable {
        require(bytes(title).length > 0, "Title required");
        require(msg.value >= bounty, "Insufficient bounty");
        
        questionCounter++;
        questions[questionCounter] = Question({
            id: questionCounter,
            asker: msg.sender,
            title: title,
            timestamp: block.timestamp,
            bounty: bounty
        });
        
        emit QuestionAsked(questionCounter, msg.sender, title);
    }
    
    function postAnswer(uint256 questionId, string memory content) external {
        require(questions[questionId].id != 0, "Question not found");
        require(bytes(content).length > 0, "Content required");
        
        answerCounter++;
        answers[answerCounter] = Answer({
            id: answerCounter,
            questionId: questionId,
            author: msg.sender,
            content: content,
            timestamp: block.timestamp
        });
        
        reputation[msg.sender]++;
        emit AnswerPosted(answerCounter, questionId, msg.sender);
    }
    
    function approveAnswer(uint256 questionId, uint256 answerId) external {
        require(questions[questionId].asker == msg.sender, "Not question asker");
        require(answers[answerId].questionId == questionId, "Invalid answer");
        
        reputation[answers[answerId].author] += 5;
        payable(answers[answerId].author).transfer(questions[questionId].bounty);
    }
    
    function getQuestion(uint256 questionId) external view returns (
        uint256 id,
        address asker,
        string memory title,
        uint256 timestamp,
        uint256 bounty
    ) {
        Question storage q = questions[questionId];
        return (q.id, q.asker, q.title, q.timestamp, q.bounty);
    }
    
    function getAnswer(uint256 answerId) external view returns (
        uint256 id,
        uint256 questionId,
        address author,
        string memory content,
        uint256 timestamp
    ) {
        Answer storage a = answers[answerId];
        return (a.id, a.questionId, a.author, a.content, a.timestamp);
    }
    
    function getUserReputation(address user) external view returns (uint256) {
        return reputation[user];
    }
    
    function getStats() external view returns (uint256 questions, uint256 answers) {
        return (questionCounter, answerCounter);
    }
}
