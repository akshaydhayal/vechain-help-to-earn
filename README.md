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
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/        # Next.js app router
│   │   ├── components/ # React components
│   │   └── utils/      # Utility functions
├── scripts/            # Deployment and testing scripts
├── docs/              # Development documentation
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- VeWorld Wallet
- VET tokens (for testnet)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vechain-quora
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Add your WalletConnect Project ID
   ```

4. **Deploy the contract**
   ```bash
   npm run deploy
   ```

5. **Start the frontend**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

## 🔗 Contract Information

- **Network**: VeChain Testnet
- **Contract Address**: `0x25d137e1d0bf7f135706803cd7722946e483aecf`
- **Explorer**: [View on VeChain Explorer](https://explore-testnet.vechain.org/transactions/0x25d137e1d0bf7f135706803cd7722946e483aecf)

## 📚 Documentation

All development documentation and implementation details are available in the [`docs/`](./docs/) folder.

## 🎯 How It Works

1. **Ask Questions**: Users can post questions with VET bounties
2. **Submit Answers**: Community members provide answers
3. **Upvote System**: Users upvote quality answers
4. **Approve Answers**: Question askers approve the best answer
5. **Earn Rewards**: Answerers earn VET bounties and B3TR tokens

## 🛠️ Development

This project was built for the VeChain hackathon and demonstrates:
- VeChain blockchain integration
- VeBetterDAO rewards system
- Modern React/Next.js frontend
- Real-time transaction handling
- User-friendly wallet integration

## 📄 License

MIT License - see LICENSE file for details.
