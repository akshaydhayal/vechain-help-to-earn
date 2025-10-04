# VeChain Q&A Platform - Complete Setup Guide

## 🚀 Project Overview

This is a **VeChain hackathon project** - a decentralized Q&A platform that integrates with VeChain blockchain and VeBetterDAO rewards system.

### Key Features:
- ✅ Ask questions with VET bounties
- ✅ Submit answers to questions  
- ✅ Upvote answers to increase reputation
- ✅ Approve best answers (question asker only)
- ✅ Earn VET bounties for approved answers
- ✅ Earn B3TR tokens from VeBetterDAO
- ✅ User reputation tracking
- ✅ Anti-farming mechanisms

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **VET tokens** on VeChain testnet for deployment
3. **Private key** with VET tokens
4. **VeChain wallet** (VeWorld, Sync, etc.)

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` and add your private key:
```env
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

### 2. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

### 4. Deploy to VeChain Testnet

```bash
# Deploy the contract
npm run deploy
```

### 5. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

## 🎯 Usage Guide

### For Developers:

1. **Deploy Contract:**
   ```bash
   npm run deploy
   ```

2. **Run Demo:**
   ```bash
   npm run demo
   ```

3. **Test Contract:**
   ```bash
   npm run test
   ```

### For Users:

1. **Connect VeChain Wallet** using VeChain Kit
2. **Ask Questions** with optional VET bounties
3. **Submit Answers** to earn rewards
4. **Upvote Answers** to increase reputation
5. **Approve Best Answers** (if you asked the question)

## 🔧 Contract Details

### Contract Address
After deployment, your contract address will be saved in `simple-qa-deployment.json`

### Key Functions:
- `askQuestion(title, description)` - Ask a question with optional bounty
- `submitAnswer(questionId, content)` - Submit an answer
- `upvoteAnswer(answerId)` - Upvote an answer
- `approveAnswer(answerId)` - Approve best answer (question asker only)

## 🌐 Network Configuration

### VeChain Testnet:
- **RPC URL:** https://testnet.vechain.org
- **Chain ID:** 39
- **Explorer:** https://explore-testnet.vechain.org

### VeChain Mainnet:
- **RPC URL:** https://mainnet.vechain.org  
- **Chain ID:** 74
- **Explorer:** https://explore.vechain.org

## 🎁 Rewards System

### VET Bounties:
- Question askers can attach VET bounties
- Approved answerers receive the full bounty

### B3TR Tokens:
- Integrated with VeBetterDAO X2Earn system
- 5 B3TR tokens per approved answer
- Automatic distribution via smart contract

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

### Common Issues:

1. **"Insufficient funds"** - Make sure you have VET tokens
2. **"Network not found"** - Check your network configuration
3. **"Contract not deployed"** - Run `npm run deploy` first

### Getting Help:

- Check the console for error messages
- Verify your private key is correct
- Ensure you have VET tokens for gas fees

## 🎉 Next Steps

1. Deploy your contract to VeChain testnet
2. Test all functionality
3. Integrate with real VeBetterDAO addresses
4. Customize the frontend
5. Deploy to mainnet when ready

---

**Happy Building! 🚀**

