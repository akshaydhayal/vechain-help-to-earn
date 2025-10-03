const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting VeChain Quora Simple Platform Deployment...");
  
  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "VET");
  
  // Deploy VeChainQuoraSimple contract
  console.log("\n📝 Deploying VeChainQuoraSimple contract...");
  const VeChainQuoraSimple = await ethers.getContractFactory("VeChainQuoraSimple");
  const veChainQuoraSimple = await VeChainQuoraSimple.deploy();
  await veChainQuoraSimple.waitForDeployment();
  
  const contractAddress = await veChainQuoraSimple.getAddress();
  console.log("✅ VeChainQuoraSimple deployed at:", contractAddress);
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  
  // Initialize user
  const initTx = await veChainQuoraSimple.initializeUser();
  await initTx.wait();
  console.log("✅ User initialization test passed");
  
  // Get user profile
  const [questionsAsked, answersGiven, totalUpvotes, reputation] = await veChainQuoraSimple.getUserProfile(deployer.address);
  console.log("📊 User Profile:");
  console.log("   Questions Asked:", questionsAsked.toString());
  console.log("   Answers Given:", answersGiven.toString());
  console.log("   Total Upvotes:", totalUpvotes.toString());
  console.log("   Reputation:", reputation.toString());
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    network: "vechain_testnet",
    contractType: "VeChainQuoraSimple",
    platformStats: {
      totalQuestions: "0",
      totalAnswers: "0",
      totalUsers: "1"
    },
    explorerUrl: `https://explore-testnet.vechain.org/transactions/${contractAddress}`
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment-info.json");
  
  console.log("\n🎉 VeChain Quora Simple Platform deployed successfully!");
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
