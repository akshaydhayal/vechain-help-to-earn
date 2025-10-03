const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting VeChain Quora Platform Deployment...");
  
  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "VET");
  
  // Deploy VeChainQuora main contract
  console.log("\n📝 Deploying VeChainQuora main contract...");
  const VeChainQuora = await ethers.getContractFactory("VeChainQuora");
  const veChainQuora = await VeChainQuora.deploy();
  await veChainQuora.waitForDeployment();
  
  const mainContractAddress = await veChainQuora.getAddress();
  console.log("✅ VeChainQuora deployed at:", mainContractAddress);
  
  // Get sub-contract addresses
  const [questionManagerAddr, rewardSystemAddr] = await veChainQuora.getContractAddresses();
  console.log("📋 QuestionManager deployed at:", questionManagerAddr);
  console.log("🎁 RewardSystem deployed at:", rewardSystemAddr);
  
  // Get platform stats
  const [totalUsers, totalQuestions, totalAnswers, totalRewards] = await veChainQuora.getPlatformStats();
  console.log("\n📊 Platform Statistics:");
  console.log("   Total Users:", totalUsers.toString());
  console.log("   Total Questions:", totalQuestions.toString());
  console.log("   Total Answers:", totalAnswers.toString());
  console.log("   Total Rewards:", totalRewards.toString());
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  
  // Register a user
  const registerTx = await veChainQuora.registerUser();
  await registerTx.wait();
  console.log("✅ User registration test passed");
  
  // Get updated stats
  const [updatedUsers, , , ] = await veChainQuora.getPlatformStats();
  console.log("📈 Updated user count:", updatedUsers.toString());
  
  // Save deployment info
  const deploymentInfo = {
    mainContract: mainContractAddress,
    questionManager: questionManagerAddr,
    rewardSystem: rewardSystemAddr,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    network: "vechain_testnet",
    contractType: "VeChainQuora",
    platformStats: {
      totalUsers: totalUsers.toString(),
      totalQuestions: totalQuestions.toString(),
      totalAnswers: totalAnswers.toString(),
      totalRewards: totalRewards.toString()
    },
    explorerUrls: {
      mainContract: `https://explore-testnet.vechain.org/transactions/${mainContractAddress}`,
      questionManager: `https://explore-testnet.vechain.org/transactions/${questionManagerAddr}`,
      rewardSystem: `https://explore-testnet.vechain.org/transactions/${rewardSystemAddr}`
    }
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment-info.json");
  
  console.log("\n🎉 VeChain Quora Platform deployed successfully!");
  console.log("📋 Contract Addresses:");
  console.log("   Main Contract:", mainContractAddress);
  console.log("   Question Manager:", questionManagerAddr);
  console.log("   Reward System:", rewardSystemAddr);
  
  console.log("\n🔗 VeChain Testnet Explorer Links:");
  console.log("   Main Contract:", `https://explore-testnet.vechain.org/transactions/${mainContractAddress}`);
  console.log("   Question Manager:", `https://explore-testnet.vechain.org/transactions/${questionManagerAddr}`);
  console.log("   Reward System:", `https://explore-testnet.vechain.org/transactions/${rewardSystemAddr}`);
  
  console.log("\n📋 Next Steps:");
  console.log("   1. Verify contracts on VeChain Explorer");
  console.log("   2. Set up frontend with VeChain Kit integration");
  console.log("   3. Integrate VeBetter DAO rewards");
  console.log("   4. Test Q&A functionality");
  
  console.log("\n🎯 Platform Features:");
  console.log("   • Ask questions with VET bounties");
  console.log("   • Answer questions and earn rewards");
  console.log("   • Upvote/downvote answers");
  console.log("   • Approve best answers");
  console.log("   • Earn B3TR tokens from VeBetter DAO");
  console.log("   • Anti-farming mechanisms");
  console.log("   • User reputation system");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
