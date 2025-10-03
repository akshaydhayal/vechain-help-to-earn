# VeChain Quora Frontend

A beautiful, modern frontend for the VeChain Quora X-to-Earn Q&A platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔗 **VeChain Kit Integration** - Seamless VeWorld wallet connection
- 💰 **VeBetter DAO Integration** - B3TR token rewards distribution
- 🎯 **Anti-Farming Mechanisms** - Smart reward distribution to prevent abuse
- 🎨 **Modern UI/UX** - Clean, responsive design with Tailwind CSS
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast Performance** - Optimized for speed and user experience

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **Blockchain**: VeChain Kit for wallet integration
- **Icons**: Lucide React

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

The following environment variables are configured in `next.config.js`:

- `NEXT_PUBLIC_VECHAIN_TESTNET_URL` - VeChain testnet RPC URL
- `NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS` - Main contract address
- `NEXT_PUBLIC_QUESTION_MANAGER_ADDRESS` - QuestionManager contract address
- `NEXT_PUBLIC_REWARD_SYSTEM_ADDRESS` - RewardSystem contract address

## Deployment

This app is designed to be deployed on Vercel without any backend requirements:

1. **Connect to Vercel**
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

2. **Deploy**
   - Vercel will build and deploy automatically
   - No additional configuration needed

## Features Overview

### 🎯 Core Functionality
- **Ask Questions**: Users can ask questions with VET bounties
- **Answer Questions**: Provide helpful answers to earn rewards
- **Vote System**: Upvote/downvote answers for quality control
- **Best Answer**: Question askers can approve the best answer
- **Reputation System**: Build reputation through quality contributions

### 🛡️ Anti-Farming Mechanisms
- **Time Limits**: Minimum intervals between questions/answers
- **Daily Limits**: Maximum questions/answers per day
- **Reputation Requirements**: Minimum reputation to ask questions
- **Engagement Scoring**: Rewards based on quality and engagement
- **AI-Powered**: Content moderation and quality assessment

### 💎 VeBetter DAO Integration
- **B3TR Rewards**: Earn B3TR tokens for quality contributions
- **Reward Pools**: Managed by VeBetter DAO
- **Multiplier System**: Higher rewards for approved answers
- **Verified Users**: Bonus rewards for verified users

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   └── ...             # Feature components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── public/                 # Static assets
└── ...                     # Configuration files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
