# 🚀 Deployment Guide: GitHub + Vercel

## 📋 **Step-by-Step Deployment Process**

### **🔗 Step 1: Deploy to GitHub**

#### **1.1 Initialize Git Repository**
```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit: VeChain Q&A Platform"
```

#### **1.2 Create GitHub Repository**
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `vechain-quora` (or your preferred name)
4. Make it **Public** (for hackathon visibility)
5. **Don't** initialize with README (you already have one)

#### **1.3 Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/vechain-quora.git
git branch -M main
git push -u origin main
```

### **🌐 Step 2: Deploy Frontend to Vercel**

#### **2.1 Connect Vercel to GitHub**
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `vechain-quora` repository

#### **2.2 Configure Vercel Project**
- **Framework Preset**: `Next.js`
- **Root Directory**: `frontend` ⚠️ **IMPORTANT**
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)

#### **2.3 Environment Variables for Vercel**

##### **🔑 Required Environment Variables:**

```bash
# VeChain Kit Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_reown_project_id_here

# VeChain Transaction Configuration (REQUIRED)
PRIVATE_KEY=your_actual_private_key_here
VECHAIN_TESTNET_URL=https://testnet.vechain.org
```

##### **📝 How to Set Environment Variables in Vercel:**

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" tab
   - Click "Environment Variables"
   - Add these variables:
     - **Name**: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`, **Value**: Your actual Reown project ID
     - **Name**: `PRIVATE_KEY`, **Value**: Your actual private key (REQUIRED - no fallback)
     - **Name**: `VECHAIN_TESTNET_URL`, **Value**: `https://testnet.vechain.org`
     - **Environment**: Production, Preview, Development (all)

2. **Get Your Reown Project ID:**
   - Go to [https://cloud.reown.com](https://cloud.reown.com)
   - Create account/login
   - Create new project
   - Copy the Project ID

### **📁 Project Structure for Deployment**

```
vechain-quora/                    # GitHub Repository
├── README.md                    # Main project README
├── contracts/                   # Smart contracts (GitHub only)
├── scripts/                     # Deployment scripts (GitHub only)
├── docs/                       # Documentation (GitHub only)
└── frontend/                   # Next.js app (Vercel deployment)
    ├── src/
    ├── package.json
    ├── vercel.json             # Vercel configuration
    └── .env.example
```

### **✅ Deployment Checklist**

#### **GitHub Repository:**
- [ ] Repository created and public
- [ ] All code pushed to GitHub
- [ ] README.md is clean and professional
- [ ] Documentation organized in `docs/` folder

#### **Vercel Deployment:**
- [ ] Vercel account connected to GitHub
- [ ] Project imported with `frontend` as root directory
- [ ] Environment variables set:
  - [ ] `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- [ ] Build successful
- [ ] Domain configured (optional)

### **🔧 Troubleshooting**

#### **Common Issues:**

1. **Build Fails on Vercel:**
   - Check that root directory is set to `frontend`
   - Verify all dependencies are in `package.json`
   - Check build logs in Vercel dashboard

2. **Environment Variables Not Working:**
   - Ensure variables start with `NEXT_PUBLIC_`
   - Redeploy after adding environment variables
   - Check variable names match exactly

3. **Wallet Connection Issues:**
   - Verify `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` is set
   - Check that the project ID is correct
   - Ensure the domain is added to Reown project settings

### **🌐 Final URLs**

After deployment, you'll have:
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/vechain-quora`
- **Live Website**: `https://vechain-quora.vercel.app` (or your custom domain)

### **📱 Testing Your Deployment**

1. **Visit your Vercel URL**
2. **Connect VeWorld wallet**
3. **Test asking a question**
4. **Test answering questions**
5. **Verify transactions work**

---

**🎉 Your VeChain Q&A Platform will be live on the internet!**
