const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting VeChain Quora Ultra-Minimal Platform Deployment...");
  
  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "VET");
  
  // Deploy VeChainQuoraUltraMinimal contract
  console.log("\n📝 Deploying VeChainQuoraUltraMinimal contract...");
  const VeChainQuoraUltraMinimal = await ethers.getContractFactory("VeChainQuoraUltraMinimal");
  const veChainQuoraUltraMinimal = await VeChainQuoraUltraMinimal.deploy();
  await veChainQuoraUltraMinimal.waitForDeployment();
  
  const contractAddress = await veChainQuoraUltraMinimal.getAddress();
  console.log("✅ VeChainQuoraUltraMinimal deployed at:", contractAddress);
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  
  // Get platform stats
  const [totalQuestions, totalAnswers] = await veChainQuoraUltraMinimal.getStats();
  console.log("\n📊 Platform Statistics:");
  console.log("   Total Questions:", totalQuestions.toString());
  console.log("   Total Answers:", totalAnswers.toString());
  
  // Get user reputation
  const userReputation = await veChainQuoraUltraMinimal.getUserReputation(deployer.address);
  console.log("   User Reputation:", userReputation.toString());
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    network: "vechain_testnet",
    contractType: "VeChainQuoraUltraMinimal",
    platformStats: {
      totalQuestions: totalQuestions.toString(),
      totalAnswers: totalAnswers.toString()
    },
    explorerUrl: `https://explore-testnet.vechain.org/transactions/${contractAddress}`
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment-info.json");
  
  console.log("\n🎉 VeChain Quora Ultra-Minimal Platform deployed successfully!");
  console.log("📋 Contract Address:", contractAddress);
  console.log("🔗 VeChain Testnet Explorer:", `https://explore-testnet.vechain.org/transactions/${contractAddress}`);
  
  console.log("\n📋 Next Steps:");
  console.log("   1. Verify contract on VeChain Explorer");
  console.log("   2. Set up frontend with VeChain Kit integration");
  console.log("   3. Test Q&A functionality");
  
  console.log("\n🎯 Platform Features:");
  console.log("   • Ask questions with VET bounties");
  console.log("   • Answer questions and earn reputation");
  console.log("   • Approve best answers");
  console.log("   • User reputation system");
  console.log("   • Platform statistics");
  
  console.log("\n💡 Gas Usage Analysis:");
  console.log("   • This ultra-minimal contract uses the least gas possible");
  console.log("   • Perfect for testnet deployment and testing");
  console.log("   • Can be upgraded to full version later");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
