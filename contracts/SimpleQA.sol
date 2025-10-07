// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface for VeBetterDAO X2EarnRewardsPool
interface IX2EarnRewardsPool {
    function distributeReward(
        bytes32 appId,
        uint256 amount,
        address receiver,
        string memory proof
    ) external;
    
    function availableFunds(bytes32 appId) external view returns (uint256);
}

contract SimpleQA {
    
    // Contract owner
    address public owner;
    
    // VeBetterDAO integration
    IX2EarnRewardsPool public x2EarnRewardsPoolContract;
    bytes32 public appId;
    uint256 public rewardAmount = 5 * 10**18; // 5 B3TR tokens per approved answer
    
    // Question structure
    struct Question {
        uint256 id;
        address asker;
        string title;
        string description;
        uint256 bounty; // VET bounty for best answer
        bool hasApprovedAnswer;
        uint256 approvedAnswerId;
        uint256 timestamp;
    }
    
    // Answer structure
    struct Answer {
        uint256 id;
        uint256 questionId;
        address answerer;
        string content;
        uint256 upvotes;
        bool isApproved;
        uint256 timestamp;
    }
    
    // User reputation tracking
    struct User {
        address wallet;
        uint256 reputation;
        uint256 questionsAsked;
        uint256 answersGiven;
        uint256 answersApproved;
    }
    
    // Storage
    mapping(uint256 => Question) public questions;
    mapping(uint256 => Answer) public answers;
    mapping(address => User) public users;
    mapping(address => mapping(uint256 => bool)) public hasUpvoted; // user => answerId => hasUpvoted
    
    // Counters
    uint256 public questionCounter;
    uint256 public answerCounter;
    
    // Events
    event QuestionAsked(
        uint256 indexed questionId,
        address indexed asker,
        string title,
        uint256 bounty
    );
    
    event AnswerSubmitted(
        uint256 indexed answerId,
        uint256 indexed questionId,
        address indexed answerer,
        string content
    );
    
    event AnswerUpvoted(
        uint256 indexed answerId,
        address indexed upvoter,
        uint256 newUpvoteCount
    );
    
    event AnswerApproved(
        uint256 indexed answerId,
        uint256 indexed questionId,
        address indexed answerer,
        uint256 rewardAmount
    );
    
    event RewardDistributed(
        address indexed receiver,
        uint256 amount,
        string proof
    );
    
    event UserRegistered(address indexed user);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier questionExists(uint256 _questionId) {
        require(_questionId > 0 && _questionId <= questionCounter, "Question does not exist");
        _;
    }
    
    modifier answerExists(uint256 _answerId) {
        require(_answerId > 0 && _answerId <= answerCounter, "Answer does not exist");
        _;
    }
    
    constructor(
        address _x2EarnRewardsPoolContract,
        bytes32 _appId
    ) {
        owner = msg.sender;
        x2EarnRewardsPoolContract = IX2EarnRewardsPool(_x2EarnRewardsPoolContract);
        appId = _appId;
    }
    
    // Register user (optional, for tracking)
    function registerUser() external {
        if (users[msg.sender].wallet == address(0)) {
            users[msg.sender] = User({
                wallet: msg.sender,
                reputation: 0,
                questionsAsked: 0,
                answersGiven: 0,
                answersApproved: 0
            });
            emit UserRegistered(msg.sender);
        }
    }
    
    // Ask a question with optional bounty
    function askQuestion(
        string memory _title,
        string memory _description,
        address _asker
    ) external payable {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_asker != address(0), "Asker address cannot be zero");
        
        // Register user if not already registered
        if (users[_asker].wallet == address(0)) {
            users[_asker] = User({
                wallet: _asker,
                reputation: 0,
                questionsAsked: 0,
                answersGiven: 0,
                answersApproved: 0
            });
            emit UserRegistered(_asker);
        }
        
        questionCounter++;
        
        questions[questionCounter] = Question({
            id: questionCounter,
            asker: _asker,
            title: _title,
            description: _description,
            bounty: msg.value,
            hasApprovedAnswer: false,
            approvedAnswerId: 0,
            timestamp: block.timestamp
        });
        
        users[_asker].questionsAsked++;
        
        emit QuestionAsked(questionCounter, msg.sender, _title, msg.value);
    }
    
    // Submit an answer to a question
    function submitAnswer(
        uint256 _questionId,
        string memory _content,
        address _answerer
    ) external questionExists(_questionId) {
        require(bytes(_content).length > 0, "Answer content cannot be empty");
        require(_answerer != address(0), "Answerer address cannot be zero");
        // Removed restrictions: anyone can answer any question
        // require(questions[_questionId].isActive, "Question is not active");
        // require(questions[_questionId].asker != msg.sender, "Cannot answer your own question");
        
        // Register user if not already registered
        if (users[_answerer].wallet == address(0)) {
            users[_answerer] = User({
                wallet: _answerer,
                reputation: 0,
                questionsAsked: 0,
                answersGiven: 0,
                answersApproved: 0
            });
            emit UserRegistered(_answerer);
        }
        
        answerCounter++;
        
        answers[answerCounter] = Answer({
            id: answerCounter,
            questionId: _questionId,
            answerer: _answerer,
            content: _content,
            upvotes: 0,
            isApproved: false,
            timestamp: block.timestamp
        });
        
        users[_answerer].answersGiven++;
        
        emit AnswerSubmitted(answerCounter, _questionId, msg.sender, _content);
    }
    
    // Upvote an answer
    function upvoteAnswer(uint256 _answerId, address _voter) external answerExists(_answerId) {
        // Removed restrictions: anyone can upvote any answer multiple times
        // require(!hasUpvoted[msg.sender][_answerId], "Already upvoted this answer");
        // require(answers[_answerId].answerer != msg.sender, "Cannot upvote your own answer");
        
        require(_voter != address(0), "Voter address cannot be zero");
        answers[_answerId].upvotes++;
        hasUpvoted[_voter][_answerId] = true;
        
        // Increase answerer's reputation (ensure user exists first)
        if (users[answers[_answerId].answerer].wallet == address(0)) {
            users[answers[_answerId].answerer] = User({
                wallet: answers[_answerId].answerer,
                reputation: 0,
                questionsAsked: 0,
                answersGiven: 0,
                answersApproved: 0
            });
        }
        users[answers[_answerId].answerer].reputation += 1;
        
        emit AnswerUpvoted(_answerId, _voter, answers[_answerId].upvotes);
    }
    
    // Approve an answer (anyone can approve any answer)
    function approveAnswer(uint256 _answerId, address _approver) external answerExists(_answerId) {
        uint256 questionId = answers[_answerId].questionId;
        // Approval restrictions (only question asker, only one approval per question)
        require(_approver != address(0), "Approver address cannot be zero");
        require(questions[questionId].asker == _approver, "Only question asker can approve answers");
        require(!questions[questionId].hasApprovedAnswer, "Question already has an approved answer");
        
        // Mark answer as approved
        answers[_answerId].isApproved = true;
        questions[questionId].hasApprovedAnswer = true;
        questions[questionId].approvedAnswerId = _answerId;
        // Question remains open for more answers (no isActive field needed)
        
        // Update user stats (ensure user exists first)
        if (users[answers[_answerId].answerer].wallet == address(0)) {
            users[answers[_answerId].answerer] = User({
                wallet: answers[_answerId].answerer,
                reputation: 0,
                questionsAsked: 0,
                answersGiven: 0,
                answersApproved: 0
            });
        }
        users[answers[_answerId].answerer].answersApproved++;
        users[answers[_answerId].answerer].reputation += 10; // Bonus reputation for approved answer
        
        // Distribute rewards if bounty exists and contract has sufficient balance
        if (questions[questionId].bounty > 0 && address(this).balance >= questions[questionId].bounty) {
            _distributeReward(answers[_answerId].answerer, questions[questionId].bounty);
        }
        
        // Distribute VeBetterDAO rewards (only if conditions are met)
        _distributeVeBetterReward(answers[_answerId].answerer);
        
        emit AnswerApproved(_answerId, questionId, answers[_answerId].answerer, questions[questionId].bounty);
    }
    
    // Internal function to distribute VET bounty
    function _distributeReward(address _answerer, uint256 _amount) private {
        require(_amount > 0, "No bounty to distribute");
        require(address(this).balance >= _amount, "Insufficient contract balance");
        
        (bool success, ) = payable(_answerer).call{value: _amount}("");
        require(success, "VET transfer failed");
    }
    
    // Internal function to distribute VeBetterDAO rewards
    function _distributeVeBetterReward(address _answerer) private {
        require(rewardAmount > 0, "Reward amount must be greater than 0");
        require(
            rewardAmount <= x2EarnRewardsPoolContract.availableFunds(appId),
            "Insufficient funds in VeBetterDAO rewards pool"
        );
        
        // Create proof string
        string memory proof = string(abi.encodePacked(
            '{"type":"qa_platform","action":"answer_approved","answerer":"',
            _toAsciiString(_answerer),
            '","timestamp":"',
            _uint2str(block.timestamp),
            '"}'
        ));
        
        // Call VeBetterDAO to distribute rewards
        x2EarnRewardsPoolContract.distributeReward(
            appId,
            rewardAmount,
            _answerer,
            proof
        );
        
        emit RewardDistributed(_answerer, rewardAmount, proof);
    }
    
    // View functions
    function getQuestion(uint256 _questionId) external view questionExists(_questionId) returns (
        uint256 id,
        address asker,
        string memory title,
        string memory description,
        uint256 bounty,
        bool hasApprovedAnswer,
        uint256 approvedAnswerId,
        uint256 timestamp
    ) {
        Question storage q = questions[_questionId];
        return (
            q.id,
            q.asker,
            q.title,
            q.description,
            q.bounty,
            q.hasApprovedAnswer,
            q.approvedAnswerId,
            q.timestamp
        );
    }
    
    function getAnswer(uint256 _answerId) external view answerExists(_answerId) returns (
        uint256 id,
        uint256 questionId,
        address answerer,
        string memory content,
        uint256 upvotes,
        bool isApproved,
        uint256 timestamp
    ) {
        Answer storage a = answers[_answerId];
        return (
            a.id,
            a.questionId,
            a.answerer,
            a.content,
            a.upvotes,
            a.isApproved,
            a.timestamp
        );
    }
    
    // Get question asker information
    function getQuestionAsker(uint256 _questionId) external view questionExists(_questionId) returns (address asker) {
        return questions[_questionId].asker;
    }
    
    // Get answerer information
    function getAnswerer(uint256 _answerId) external view answerExists(_answerId) returns (address answerer) {
        return answers[_answerId].answerer;
    }
    
    function getUser(address _user) external view returns (
        address wallet,
        uint256 reputation,
        uint256 questionsAsked,
        uint256 answersGiven,
        uint256 answersApproved
    ) {
        User storage u = users[_user];
        return (
            u.wallet,
            u.reputation,
            u.questionsAsked,
            u.answersGiven,
            u.answersApproved
        );
    }
    
    function getPlatformStats() external view returns (
        uint256 totalQuestions,
        uint256 totalAnswers,
        uint256 totalUsers,
        uint256 contractBalance
    ) {
        return (
            questionCounter,
            answerCounter,
            // Count non-zero users (simple way to count users)
            questionCounter + answerCounter, // Approximation
            address(this).balance
        );
    }
    
    // Owner functions
    function setRewardAmount(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        rewardAmount = _amount;
    }
    
    function updateAppId(bytes32 _appId) external onlyOwner {
        appId = _appId;
    }
    
    function withdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    // Helper functions
    function _toAsciiString(address x) private pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(s);
    }
    
    function char(bytes1 b) private pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
    
    function _uint2str(uint256 _i) private pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
