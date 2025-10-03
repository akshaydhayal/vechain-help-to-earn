# VeChain Kit with Reown Project ID Setup

## 🔧 Required Configuration

### 1. Get Your Reown Project ID

1. **Visit Reown Cloud**: Go to [https://cloud.reown.com/](https://cloud.reown.com/)
2. **Create Account**: Sign up or log in
3. **Create Project**: Create a new project
4. **Get Project ID**: Copy your project ID

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Reown Project ID (Required for VeChain Kit)
NEXT_PUBLIC_REOWN_PROJECT_ID=your_actual_project_id_here

# VeChain Testnet Configuration
NEXT_PUBLIC_VECHAIN_TESTNET_URL=https://testnet.vechain.org

# Contract Addresses (Deployed on VeChain Testnet)
NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS=0x90a2c4a5a53278d5d81f92e60503073b89fd1b63
NEXT_PUBLIC_QUESTION_MANAGER_ADDRESS=0x9A202C7Ed53BdCB6e3832F5DD14860Ee144e41CA
NEXT_PUBLIC_REWARD_SYSTEM_ADDRESS=0xce633774B928829CdA322B8c0d5690A276DC4C33
```

### 3. Update VeChain Kit Provider

The VeChain Kit provider is already configured in `src/components/VeChainKitProvider.tsx`:

```typescript
<VeChainKitProvider
  walletConnectOptions={{
    projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID',
    metadata: {
      name: 'VeChain Quora',
      description: 'X-to-Earn Q&A Platform on VeChain',
      url: 'https://vechain-quora.vercel.app',
      icons: ['https://vechain-quora.vercel.app/icon.png'],
    },
  }}
>
```

## 🚀 Installation Steps

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add your Reown project ID
nano .env.local
```

### 3. Start Development Server
```bash
npm run dev
```

## 🔗 VeWorld Wallet Integration

### Features
- ✅ **Real VeWorld Wallet**: Direct connection to VeWorld
- ✅ **VeChain Kit**: Official VeChain wallet integration
- ✅ **Reown Project ID**: Your own project configuration
- ✅ **WalletConnect**: Secure wallet connection
- ✅ **Auto-reconnection**: Persistent wallet sessions

### Wallet Connection Flow
1. User clicks "Connect VeWorld Wallet"
2. VeChain Kit opens VeWorld wallet
3. User approves connection in VeWorld
4. Wallet is connected and ready to use
5. User can interact with smart contracts

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Project ID not found"
**Solution**: Make sure you've set `NEXT_PUBLIC_REOWN_PROJECT_ID` in `.env.local`

#### 2. "VeWorld wallet not found"
**Solution**: 
- Install VeWorld wallet extension
- Make sure it's unlocked
- Refresh the page

#### 3. "Connection failed"
**Solution**:
- Check your Reown project ID
- Verify VeWorld wallet is working
- Check browser console for errors

### Debug Steps
1. Check environment variables
2. Verify VeWorld wallet installation
3. Check browser console
4. Test wallet connection manually

## 📱 Production Deployment

### Vercel Deployment
1. **Set Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_REOWN_PROJECT_ID`
   - `NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_QUESTION_MANAGER_ADDRESS`
   - `NEXT_PUBLIC_REWARD_SYSTEM_ADDRESS`

2. **Deploy**:
   ```bash
   git push origin main
   ```

### Environment Variables for Production
```env
NEXT_PUBLIC_REOWN_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS=0x90a2c4a5a53278d5d81f92e60503073b89fd1b63
NEXT_PUBLIC_QUESTION_MANAGER_ADDRESS=0x9A202C7Ed53BdCB6e3832F5DD14860Ee144e41CA
NEXT_PUBLIC_REWARD_SYSTEM_ADDRESS=0xce633774B928829CdA322B8c0d5690A276DC4C33
```

## 🎯 Next Steps

1. **Get Reown Project ID**: Sign up at [cloud.reown.com](https://cloud.reown.com/)
2. **Configure Environment**: Add project ID to `.env.local`
3. **Test Connection**: Try connecting VeWorld wallet
4. **Deploy**: Push to production

## 📞 Support

- **VeChain Kit Docs**: [docs.vechainkit.vechain.org](https://docs.vechainkit.vechain.org/)
- **Reown Cloud**: [cloud.reown.com](https://cloud.reown.com/)
- **VeWorld Wallet**: [veworld.net](https://veworld.net/)

Your VeChain Quora platform is now ready for real VeWorld wallet integration! 🚀
