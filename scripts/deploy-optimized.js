const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting VeChain Quora Optimized Platform Deployment...");
  
  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "VET");
  
  // Deploy VeChainQuoraOptimized contract
  console.log("\n📝 Deploying VeChainQuoraOptimized contract...");
  const VeChainQuoraOptimized = await ethers.getContractFactory("VeChainQuoraOptimized");
  const veChainQuoraOptimized = await VeChainQuoraOptimized.deploy();
  await veChainQuoraOptimized.waitForDeployment();
  
  const contractAddress = await veChainQuoraOptimized.getAddress();
  console.log("✅ VeChainQuoraOptimized deployed at:", contractAddress);
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  
  // Register a user
  const registerTx = await veChainQuoraOptimized.registerUser();
  await registerTx.wait();
  console.log("✅ User registration test passed");
  
  // Get user profile
  const [questionsAsked, answersGiven, totalUpvotes, reputation, isVerified] = await veChainQuoraOptimized.getUserProfile(deployer.address);
  console.log("📊 User Profile:");
  console.log("   Questions Asked:", questionsAsked.toString());
  console.log("   Answers Given:", answersGiven.toString());
  console.log("   Total Upvotes:", totalUpvotes.toString());
  console.log("   Reputation:", reputation.toString());
  console.log("   Is Verified:", isVerified);
  
  // Get platform stats
  const [totalUsers, totalQuestions, totalAnswers, totalRewards] = await veChainQuoraOptimized.getPlatformStats();
  console.log("\n📊 Platform Statistics:");
  console.log("   Total Users:", totalUsers.toString());
  console.log("   Total Questions:", totalQuestions.toString());
  console.log("   Total Answers:", totalAnswers.toString());
  console.log("   Total Rewards:", totalRewards.toString());
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    network: "vechain_testnet",
    contractType: "VeChainQuoraOptimized",
    platformStats: {
      totalUsers: totalUsers.toString(),
      totalQuestions: totalQuestions.toString(),
      totalAnswers: totalAnswers.toString(),
      totalRewards: totalRewards.toString()
    },
    explorerUrl: `https://explore-testnet.vechain.org/transactions/${contractAddress}`
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment-info.json");
  
  console.log("\n🎉 VeChain Quora Optimized Platform deployed successfully!");
  console.log("📋 Contract Address:", contractAddress);
  console.log("🔗 VeChain Testnet Explorer:", `https://explore-testnet.vechain.org/transactions/${contractAddress}`);
  
  console.log("\n📋 Next Steps:");
  console.log("   1. Verify contract on VeChain Explorer");
  console.log("   2. Set up frontend with VeChain Kit integration");
  console.log("   3. Test Q&A functionality");
  
  console.log("\n🎯 Platform Features:");
  console.log("   • Ask questions with VET bounties");
  console.log("   • Answer questions and earn reputation");
  console.log("   • Upvote/downvote answers");
  console.log("   • Approve best answers");
  console.log("   • Anti-farming mechanisms");
  console.log("   • User reputation system");
  console.log("   • Daily limits and time restrictions");
  console.log("   • User verification system");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
