# 🚀 VeChain Q&A Platform - Hackathon Project

A decentralized Q&A platform built on VeChain blockchain with VeBetterDAO integration for rewards distribution.

## ✨ Features

- **Ask Questions** with VET bounties
- **Submit Answers** to earn rewards
- **Upvote System** for community-driven quality
- **Reputation Tracking** for users
- **VeBetterDAO Integration** for B3TR token rewards
- **Anti-farming Mechanisms** to prevent abuse
- **Modern Frontend** with VeChain Kit integration

## 🏗️ Project Structure

```
vechain-quora/
├── contracts/           # Solidity smart contracts
│   └── SimpleQA.sol    # Main Q&A contract
├── scripts/            # Deployment and testing scripts
│   ├── deploy-simple-qa.js
│   ├── demo-simple-qa.js
│   ├── test-simple-qa.js
│   └── test-simple.js
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── package.json
├── artifacts/          # Compiled contract artifacts
├── cache/             # Hardhat cache
└── package.json       # Main project dependencies
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js (v18 or higher)
- VET tokens on VeChain testnet
- Private key with VET tokens

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd vechain-quora

# Install dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` and add your private key:
```env
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

### 4. Compile Contracts

```bash
npm run compile
```

### 5. Test Locally

```bash
npm run test:local
```

### 6. Deploy to VeChain Testnet

```bash
npm run deploy
```

### 7. Start Frontend

```bash
npm run frontend:dev
```

## 🎯 Usage

### For Developers

```bash
# Compile contracts
npm run compile

# Test locally
npm run test:local

# Deploy to testnet
npm run deploy

# Run demo
npm run demo

# Start frontend development
npm run frontend:dev
```

### For Users

1. **Connect VeChain Wallet** using VeChain Kit
2. **Ask Questions** with optional VET bounties
3. **Submit Answers** to earn rewards
4. **Upvote Answers** to increase reputation
5. **Approve Best Answers** (if you asked the question)

## 🔧 Smart Contract Functions

### Core Functions

- `askQuestion(title, description)` - Ask a question with optional bounty
- `submitAnswer(questionId, content)` - Submit an answer
- `upvoteAnswer(answerId)` - Upvote an answer
- `approveAnswer(answerId)` - Approve best answer (question asker only)

### View Functions

- `getQuestion(questionId)` - Get question details
- `getAnswer(answerId)` - Get answer details
- `getUser(address)` - Get user statistics
- `getPlatformStats()` - Get platform statistics

## 🌐 Network Configuration

### VeChain Testnet
- **RPC URL:** https://testnet.vechain.org
- **Chain ID:** 39
- **Explorer:** https://explore-testnet.vechain.org

### VeChain Mainnet
- **RPC URL:** https://mainnet.vechain.org
- **Chain ID:** 74
- **Explorer:** https://explore.vechain.org

## 🎁 Rewards System

### VET Bounties
- Question askers can attach VET bounties
- Approved answerers receive the full bounty
- Automatic distribution via smart contract

### B3TR Tokens
- Integrated with VeBetterDAO X2Earn system
- 5 B3TR tokens per approved answer
- Automatic distribution via smart contract

## 🛠️ Development

### Contract Development

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy-simple-qa.js --network localhost
```

### Frontend Development

```bash
cd frontend
npm run dev
```

## 📊 Testing

The project includes comprehensive testing:

- **Local Testing:** `npm run test:local`
- **Testnet Testing:** `npm run test`
- **Demo Script:** `npm run demo`

## 🔗 Integration

### VeChain Kit
The frontend uses VeChain Kit for wallet connection and transaction handling.

### VeBetterDAO
The contract integrates with VeBetterDAO for B3TR token rewards distribution.

## 🚨 Important Notes

1. **Private Key Security:** Never commit your private key to version control
2. **Testnet Tokens:** Get VET testnet tokens from VeChain faucet
3. **Gas Fees:** VeChain has very low gas fees compared to Ethereum
4. **VeBetterDAO Integration:** Currently using dummy addresses for testing

## 🔗 Useful Links

- [VeChain Documentation](https://docs.vechain.org/)
- [VeChain Kit Documentation](https://kit.vecha.in/)
- [VeBetterDAO](https://vebetterdao.org/)
- [VeChain Testnet Faucet](https://faucet.vecha.in/)

## 🐛 Troubleshooting

### Common Issues

1. **"Insufficient funds"** - Make sure you have VET tokens
2. **"Network not found"** - Check your network configuration
3. **"Contract not deployed"** - Run `npm run deploy` first

### Getting Help

- Check the console for error messages
- Verify your private key is correct
- Ensure you have VET tokens for gas fees

## 🎉 Next Steps

1. Deploy your contract to VeChain testnet
2. Test all functionality
3. Integrate with real VeBetterDAO addresses
4. Customize the frontend
5. Deploy to mainnet when ready

## 📄 License

MIT License - see LICENSE file for details.

---

**Happy Building! 🚀**