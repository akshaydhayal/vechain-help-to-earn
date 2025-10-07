export const contractAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_x2EarnRewardsPoolContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_appId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "answerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "questionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "answerer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
    ],
    name: "AnswerApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "answerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "questionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "answerer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "content",
        type: "string",
      },
    ],
    name: "AnswerSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "answerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "upvoter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newUpvoteCount",
        type: "uint256",
      },
    ],
    name: "AnswerUpvoted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "questionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "asker",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bounty",
        type: "uint256",
      },
    ],
    name: "QuestionAsked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "proof",
        type: "string",
      },
    ],
    name: "RewardDistributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "UserRegistered",
    type: "event",
  },
  {
    inputs: [],
    name: "answerCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "answers",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "questionId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "answerer",
        type: "address",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "upvotes",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "appId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_answerId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_approver",
        type: "address",
      },
    ],
    name: "approveAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "address",
        name: "_asker",
        type: "address",
      },
    ],
    name: "askQuestion",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_answerId",
        type: "uint256",
      },
    ],
    name: "getAnswer",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "questionId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "answerer",
        type: "address",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "upvotes",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_answerId",
        type: "uint256",
      },
    ],
    name: "getAnswerer",
    outputs: [
      {
        internalType: "address",
        name: "answerer",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformStats",
    outputs: [
      {
        internalType: "uint256",
        name: "totalQuestions",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAnswers",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalUsers",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "contractBalance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_questionId",
        type: "uint256",
      },
    ],
    name: "getQuestion",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "asker",
        type: "address",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "bounty",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "hasApprovedAnswer",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "approvedAnswerId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_questionId",
        type: "uint256",
      },
    ],
    name: "getQuestionAsker",
    outputs: [
      {
        internalType: "address",
        name: "asker",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUser",
    outputs: [
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "reputation",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "questionsAsked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "answersGiven",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "answersApproved",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "hasUpvoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "questionCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "questions",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "asker",
        type: "address",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "bounty",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "hasApprovedAnswer",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "approvedAnswerId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registerUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "setRewardAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_questionId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_content",
        type: "string",
      },
      {
        internalType: "address",
        name: "_answerer",
        type: "address",
      },
    ],
    name: "submitAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_appId",
        type: "bytes32",
      },
    ],
    name: "updateAppId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_answerId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "upvoteAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "reputation",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "questionsAsked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "answersGiven",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "answersApproved",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "x2EarnRewardsPoolContract",
    outputs: [
      {
        internalType: "contract IX2EarnRewardsPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
