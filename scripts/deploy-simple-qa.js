const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Simple Q&A Platform Deployment...");
  
  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "VET");
  
  // For now, we'll use dummy addresses for VeBetterDAO integration
  // In a real deployment, you would use the actual VeBetterDAO contract addresses
  const dummyVeBetterDAO = "0x0000000000000000000000000000000000000000"; // Dummy address
  const dummyAppId = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"; // Dummy app ID
  
  console.log("\n📝 Deploying SimpleQA contract...");
  console.log("⚠️  Note: Using dummy VeBetterDAO address for testing");
  
  // Deploy SimpleQA contract
  const SimpleQA = await ethers.getContractFactory("SimpleQA");
  const simpleQA = await SimpleQA.deploy(
    dummyVeBetterDAO,
    dummyAppId
  );
  await simpleQA.waitForDeployment();
  
  const contractAddress = await simpleQA.getAddress();
  console.log("✅ SimpleQA deployed at:", contractAddress);
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  
  // Register a user
  const registerTx = await simpleQA.registerUser();
  await registerTx.wait();
  console.log("✅ User registration test passed");
  
  // Ask a question with bounty
  const askQuestionTx = await simpleQA.askQuestion(
    "What is blockchain?",
    "Can someone explain blockchain technology in simple terms?",
    deployer.address, // Pass the deployer address as the asker
    { value: ethers.parseEther("0.1") } // 0.1 VET bounty
  );
  await askQuestionTx.wait();
  console.log("✅ Question asking test passed");
  
  // Get platform stats
  const [totalQuestions, totalAnswers, totalUsers, contractBalance] = await simpleQA.getPlatformStats();
  console.log("\n📊 Platform Statistics:");
  console.log("   Total Questions:", totalQuestions.toString());
  console.log("   Total Answers:", totalAnswers.toString());
  console.log("   Total Users:", totalUsers.toString());
  console.log("   Contract Balance:", ethers.formatEther(contractBalance), "VET");
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    network: "vechain_testnet",
    contractType: "SimpleQA",
    veBetterDAO: {
      contractAddress: dummyVeBetterDAO,
      appId: dummyAppId,
      note: "Using dummy addresses for testing"
    },
    platformStats: {
      totalQuestions: totalQuestions.toString(),
      totalAnswers: totalAnswers.toString(),
      totalUsers: totalUsers.toString(),
      contractBalance: ethers.formatEther(contractBalance)
    },
    explorerUrl: `https://explore-testnet.vechain.org/transactions/${contractAddress}`,
    features: [
      "Ask questions with VET bounties",
      "Submit answers to questions",
      "Upvote answers",
      "Approve best answers (question asker only)",
      "Earn VET bounties for approved answers",
      "Earn B3TR tokens from VeBetterDAO",
      "User reputation system",
      "Anti-farming mechanisms"
    ]
  };
  
  const fs = require('fs');
  fs.writeFileSync('simple-qa-deployment.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to simple-qa-deployment.json");
  
  console.log("\n🎉 Simple Q&A Platform deployed successfully!");
  console.log("📋 Contract Address:", contractAddress);
  
  console.log("\n🔗 VeChain Testnet Explorer:");
  console.log("   Contract:", `https://explore-testnet.vechain.org/transactions/${contractAddress}`);
  
  console.log("\n📋 Next Steps:");
  console.log("   1. Verify contract on VeChain Explorer");
  console.log("   2. Set up VeBetterDAO integration with real addresses");
  console.log("   3. Create frontend with VeChain Kit");
  console.log("   4. Test Q&A functionality end-to-end");
  
  console.log("\n🎯 Platform Features:");
  console.log("   • Ask questions with VET bounties");
  console.log("   • Submit answers to questions");
  console.log("   • Upvote answers to increase reputation");
  console.log("   • Approve best answers (question asker only)");
  console.log("   • Earn VET bounties for approved answers");
  console.log("   • Earn B3TR tokens from VeBetterDAO");
  console.log("   • User reputation tracking");
  console.log("   • Anti-farming mechanisms");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
