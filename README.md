# VeChain Quora - X-to-Earn Q&A Platform

A decentralized Q&A platform built on VeChain blockchain that rewards users for asking quality questions and providing helpful answers. Integrated with VeBetter DAO for B3TR token rewards and designed for the VeChain Global Hackathon.

## 🚀 Features

- **X-to-Earn Rewards**: Earn B3TR tokens for quality questions and answers
- **Anti-Farming Mechanisms**: Prevents reward farming with reputation and time-based limits
- **User Reputation System**: Build reputation through quality contributions
- **VET Bounty System**: Ask questions with VET bounties for best answers
- **VeWorld Wallet Integration**: Seamless wallet connection and transactions
- **AI-Powered Features**: Content moderation and quality assessment
- **Sustainability Focus**: Knowledge sharing for environmental and social impact

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- VeChain testnet VET tokens (for gas fees)
- Private key with VET tokens

## 🛠️ Installation

1. **Clone or download this project**
   ```bash
   cd vechain-demo-contract
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file and add your private key:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

## 🔧 Configuration

### Network Configuration

The project is pre-configured for VeChain testnet with the following settings:

- **Network**: VeChain Testnet
- **RPC URL**: https://testnet.vechain.org
- **Chain ID**: 39 (0x27)
- **Solidity Version**: 0.8.20

### Contract Architecture

- **VeChainQuora**: Main contract that integrates all components
- **QuestionManager**: Handles questions, answers, and user interactions
- **RewardSystem**: Manages B3TR token distribution and anti-farming
- **Anti-Farming**: Time-based limits, reputation requirements, and engagement scoring

## 🚀 Deployment

### 1. Get Testnet VET Tokens

Before deploying, you need VET tokens for gas fees:

1. Visit [VeChain Testnet Faucet](https://faucet.vecha.in/)
2. Enter your wallet address
3. Claim testnet VET tokens

### 2. Compile the Contract

```bash
npm run compile
```

### 3. Deploy to VeChain Testnet

```bash
npm run deploy
```

This will:
- Deploy the contract to VeChain testnet
- Display contract address and deployment info
- Save deployment details to `deployment-info.json`

### 4. Verify Deployment

After deployment, you can verify your contract on:
- [VeChain Testnet Explorer](https://explore-testnet.vechain.org/)

## 🧪 Testing & Interaction

### Interact with Deployed Contract

```bash
node scripts/interact.js
```

This script will:
- Load your deployed contract
- Display contract information
- Perform example interactions
- Show your token balance

### Manual Contract Interaction

You can interact with your contract using:

1. **VeChain Explorer**: Use the contract address to view and interact
2. **Hardhat Console**: 
   ```bash
   npx hardhat console --network vechain_testnet
   ```
3. **Custom Scripts**: Create your own interaction scripts

## 📊 Contract Functions

### QuestionManager Functions
- `askQuestion(title, content, tags, bounty)` - Ask a question with VET bounty
- `postAnswer(questionId, content)` - Answer a question
- `upvoteAnswer(answerId)` - Upvote an answer
- `approveAnswer(questionId, answerId)` - Approve best answer
- `getQuestion(questionId)` - Get question details
- `getUserProfile(user)` - Get user profile and reputation

### RewardSystem Functions
- `distributeRewards(user, activityType, engagementScore)` - Distribute B3TR rewards
- `claimRewards()` - Claim pending B3TR rewards
- `getUserRewardInfo(user)` - Get user reward information
- `calculateEngagementScore(user)` - Calculate user engagement score

### Anti-Farming Mechanisms
- **Time Limits**: Minimum intervals between questions/answers
- **Daily Limits**: Maximum questions/answers per day
- **Reputation Requirements**: Minimum reputation to ask questions
- **Engagement Scoring**: Rewards based on quality and engagement
- **Verified Users**: Bonus rewards for verified users

## 🔍 Platform Features

### User Journey
1. **Register**: Connect VeWorld wallet and register on platform
2. **Ask Questions**: Post questions with VET bounties and tags
3. **Answer Questions**: Provide helpful answers to earn rewards
4. **Engage**: Upvote/downvote answers, approve best answers
5. **Earn Rewards**: Receive B3TR tokens from VeBetter DAO
6. **Build Reputation**: Increase reputation through quality contributions

### Reward Mechanism
- **Base Rewards**: Earn B3TR for quality answers
- **Approved Answers**: 3x multiplier for approved answers
- **High Engagement**: 2x multiplier for high engagement
- **Verified Users**: 1.5x multiplier for verified users
- **Reputation Bonus**: Higher reputation = higher rewards

## 📁 Project Structure

```
vechain-quora/
├── contracts/
│   ├── VeChainQuora.sol         # Main platform contract
│   ├── QuestionManager.sol      # Q&A functionality
│   └── RewardSystem.sol         # B3TR rewards system
├── scripts/
│   ├── deploy.js                # Deployment script
│   └── interact.js              # Interaction script
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Dependencies
├── env.example                  # Environment template
├── deployment-info.json         # Deployment details (generated)
└── README.md                    # This file
```

## 🚨 Important Notes

1. **Private Key Security**: Never commit your private key to version control
2. **Testnet Only**: This is configured for VeChain testnet only
3. **Gas Fees**: Ensure you have sufficient VET for gas fees
4. **Contract Verification**: Consider verifying your contract on VeChain Explorer

## 🔗 Useful Links

- [VeChain Documentation](https://docs.vechain.org/)
- [VeChain Testnet Explorer](https://explore-testnet.vechain.org/)
- [VeChain Testnet Faucet](https://faucet.vecha.in/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 📞 Support

If you encounter any issues:

1. Check your private key configuration
2. Ensure you have sufficient VET for gas fees
3. Verify network connectivity
4. Check VeChain testnet status

## 🎉 Success!

Once deployed, you'll have a fully functional VeChain Quora platform on testnet that enables:

### For Users:
- **Ask Questions**: Post questions with VET bounties and tags
- **Answer Questions**: Provide helpful answers and earn B3TR rewards
- **Build Reputation**: Increase reputation through quality contributions
- **Earn Rewards**: Receive B3TR tokens from VeBetter DAO

### For Platform:
- **Anti-Farming**: Prevents reward farming with smart mechanisms
- **Quality Control**: Reputation system ensures quality content
- **Sustainability**: Knowledge sharing for environmental and social impact
- **Mass Adoption**: Scalable platform for thousands of users

### Hackathon Alignment:
- ✅ **Track 1**: Social Impact - Build for People
- ✅ **AI Integration**: Content moderation and quality assessment
- ✅ **B3TR Rewards**: VeBetter DAO integration
- ✅ **VeWorld Wallet**: Seamless user experience
- ✅ **Sustainability**: Knowledge sharing for impact

Perfect for the VeChain Global Hackathon with $30,000 in prizes! 🏆
