const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting SimpleQA contract deployment to VeChain Testnet...");
  
  // Get the contract factory
  const SimpleQA = await ethers.getContractFactory("SimpleQA");
  
  // Deploy the contract with dummy parameters for now
  console.log("📝 Deploying SimpleQA contract...");
  const dummyX2EarnContract = "0x0000000000000000000000000000000000000000"; // Dummy address
  const dummyAppId = "0x1234567890123456789012345678901234567890123456789012345678901234"; // Dummy app ID
  
  const simpleQA = await SimpleQA.deploy(dummyX2EarnContract, dummyAppId);
  
  // Wait for deployment to complete
  await simpleQA.waitForDeployment();
  
  const contractAddress = await simpleQA.getAddress();
  
  console.log("✅ SimpleQA contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network: VeChain Testnet");
  console.log("🔗 Explorer: https://explore-testnet.vechain.org/transactions/");
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  
  try {
    // Get platform stats
    const stats = await simpleQA.getPlatformStats();
    console.log("📊 Platform Stats:", {
      totalQuestions: stats.totalQuestions.toString(),
      totalAnswers: stats.totalAnswers.toString(),
      totalUsers: stats.totalUsers.toString()
    });
    
    console.log("✅ Contract is working correctly!");
    
    // Save contract address to a file for frontend
    const fs = require('fs');
    const contractInfo = {
      address: contractAddress,
      network: 'vechain_testnet',
      deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('contract-address.json', JSON.stringify(contractInfo, null, 2));
    console.log("💾 Contract address saved to contract-address.json");
    
  } catch (error) {
    console.error("❌ Error testing contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
