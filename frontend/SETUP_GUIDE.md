# VeChain Quora - Real VeWorld Wallet Setup Guide

## 🚀 Quick Setup

### 1. Get Your Reown Project ID

1. **Visit**: [https://cloud.reown.com/](https://cloud.reown.com/)
2. **Sign Up/Login**: Create account or login
3. **Create Project**: Click "Create Project"
4. **Get Project ID**: Copy your project ID

### 2. Configure Environment Variables

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` and add your Reown project ID:

```env
NEXT_PUBLIC_REOWN_PROJECT_ID=your_actual_project_id_here
```

### 3. Install and Run

```bash
npm install
npm run dev
```

## 🔧 Fixed Issues

### ✅ localStorage Error Fixed
- Added proper client-side mounting checks
- Prevents SSR localStorage access errors

### ✅ Network Configuration Added
- Added VeChain testnet configuration
- Proper network setup for VeChain Kit

### ✅ VeWorld Wallet Integration
- Real VeWorld wallet connection
- VeChain Kit integration
- Reown project ID support

## 🎯 Current Status

### ✅ Working Features
- **VeChain Kit**: Properly configured
- **VeWorld Wallet**: Real wallet connection
- **Network**: VeChain testnet configured
- **Environment**: Project ID setup ready

### 🔧 What You Need to Do

1. **Get Reown Project ID**:
   - Go to [cloud.reown.com](https://cloud.reown.com/)
   - Create project
   - Copy project ID

2. **Update Environment**:
   ```bash
   # Edit .env.local
   nano .env.local
   
   # Replace YOUR_PROJECT_ID_HERE with your actual project ID
   NEXT_PUBLIC_REOWN_PROJECT_ID=your_actual_project_id_here
   ```

3. **Test Connection**:
   - Open http://localhost:3000
   - Click "Connect VeWorld Wallet"
   - VeWorld wallet should open

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Project ID not found"
**Solution**: Make sure you've set `NEXT_PUBLIC_REOWN_PROJECT_ID` in `.env.local`

#### 2. "localStorage is not defined"
**Solution**: ✅ Fixed - Added proper client-side mounting

#### 3. "Network configuration is required"
**Solution**: ✅ Fixed - Added network configuration

#### 4. "VeWorld wallet not found"
**Solution**: 
- Install VeWorld wallet extension
- Make sure it's unlocked
- Refresh the page

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   cat .env.local
   ```

2. **Verify VeWorld Wallet**:
   - Install from [veworld.net](https://veworld.net/)
   - Make sure it's unlocked
   - Check if it's connected to testnet

3. **Check Browser Console**:
   - Open developer tools
   - Look for error messages
   - Check network requests

## 🚀 Production Deployment

### Vercel Deployment

1. **Set Environment Variables** in Vercel:
   - `NEXT_PUBLIC_REOWN_PROJECT_ID`
   - `NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_QUESTION_MANAGER_ADDRESS`
   - `NEXT_PUBLIC_REWARD_SYSTEM_ADDRESS`

2. **Deploy**:
   ```bash
   git add .
   git commit -m "Add VeWorld wallet integration"
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

## 🎉 Success!

Your VeChain Quora platform now has:
- ✅ **Real VeWorld Wallet**: Direct connection
- ✅ **VeChain Kit**: Official integration
- ✅ **Reown Project ID**: Your own project
- ✅ **Network Configuration**: VeChain testnet
- ✅ **Error Handling**: Proper error management

Ready for real VeWorld wallet integration! 🚀


