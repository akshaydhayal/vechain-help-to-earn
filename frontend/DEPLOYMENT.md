# VeChain Quora Frontend Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial VeChain Quora frontend"
   git remote add origin https://github.com/yourusername/vechain-quora-frontend.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

### Option 2: Deploy from Local

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

## 🔧 Environment Variables

The following environment variables are automatically configured in `next.config.js`:

```env
NEXT_PUBLIC_VECHAIN_TESTNET_URL=https://testnet.vechain.org
NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS=0x90a2c4a5a53278d5d81f92e60503073b89fd1b63
NEXT_PUBLIC_QUESTION_MANAGER_ADDRESS=0x9A202C7Ed53BdCB6e3832F5DD14860Ee144e41CA
NEXT_PUBLIC_REWARD_SYSTEM_ADDRESS=0xce633774B928829CdA322B8c0d5690A276DC4C33
```

## 📋 Deployment Checklist

- [ ] ✅ Next.js 14 with App Router
- [ ] ✅ TypeScript configuration
- [ ] ✅ Tailwind CSS styling
- [ ] ✅ VeChain wallet integration
- [ ] ✅ Contract addresses configured
- [ ] ✅ Responsive design
- [ ] ✅ No backend required
- [ ] ✅ Vercel-ready

## 🎯 Features Deployed

### Core Functionality
- ✅ **Wallet Connection** - VeWorld wallet integration
- ✅ **Question Management** - Ask and view questions
- ✅ **Answer System** - Post and vote on answers
- ✅ **Reward System** - B3TR token integration
- ✅ **User Profiles** - Reputation and stats

### UI/UX Features
- ✅ **Modern Design** - Clean, professional interface
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Dark/Light Mode** - Automatic theme detection
- ✅ **Real-time Updates** - Live data from blockchain
- ✅ **Search & Filter** - Find questions easily

### Anti-Farming Features
- ✅ **Time Limits** - Prevent spam
- ✅ **Daily Limits** - Control activity
- ✅ **Reputation System** - Quality control
- ✅ **Engagement Scoring** - Reward quality content

## 🔗 Contract Integration

The frontend is connected to the deployed VeChain Quora contracts:

- **Main Contract**: `0x90a2c4a5a53278d5d81f92e60503073b89fd1b63`
- **QuestionManager**: `0x9A202C7Ed53BdCB6e3832F5DD14860Ee144e41CA`
- **RewardSystem**: `0xce633774B928829CdA322B8c0d5690A276DC4C33`

## 🛠️ Development

### Local Development
```bash
cd frontend
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 📱 Mobile Support

The app is fully responsive and works on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets (iPad/Android)
- 💻 Desktop computers
- 🖥️ Large screens

## 🔒 Security Features

- ✅ **Wallet Security** - VeWorld wallet integration
- ✅ **Smart Contract Security** - Audited contracts
- ✅ **Anti-Farming** - Prevents reward abuse
- ✅ **Input Validation** - Client-side validation
- ✅ **Error Handling** - Graceful error management

## 🎨 Customization

The app uses Tailwind CSS for easy customization:

- **Colors**: Update in `tailwind.config.js`
- **Components**: Modify in `src/components/`
- **Styling**: Edit in `src/app/globals.css`
- **Layout**: Update in `src/app/layout.tsx`

## 📊 Analytics

For production deployment, consider adding:

- **Google Analytics** - User tracking
- **Vercel Analytics** - Performance monitoring
- **Sentry** - Error tracking
- **Hotjar** - User behavior analysis

## 🚀 Performance

The app is optimized for:
- ⚡ **Fast Loading** - Next.js optimization
- 🖼️ **Image Optimization** - Next.js Image component
- 📦 **Code Splitting** - Automatic code splitting
- 🗜️ **Compression** - Gzip compression
- 💾 **Caching** - Smart caching strategies

## 🎯 Next Steps

After deployment:

1. **Test Wallet Connection** - Ensure VeWorld works
2. **Test Question Flow** - Ask and answer questions
3. **Test Rewards** - Verify B3TR distribution
4. **Monitor Performance** - Check Vercel analytics
5. **Gather Feedback** - User testing and feedback

## 📞 Support

For issues or questions:
- 📧 Email: support@vechainquora.com
- 💬 Discord: VeChain Quora Community
- 📖 Docs: [docs.vechainquora.com](https://docs.vechainquora.com)
- 🐛 Issues: GitHub Issues
