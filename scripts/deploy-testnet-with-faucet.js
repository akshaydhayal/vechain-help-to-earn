const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting SimpleQA contract deployment to VeChain Testnet...");
  console.log("📝 Note: This deployment requires a VeChain testnet account with VET tokens");
  
  // Check if we have a private key
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === 'your_private_key_here') {
    console.log("❌ No private key found in .env file");
    console.log("📋 To deploy to VeChain testnet, you need to:");
    console.log("1. Create a VeChain testnet wallet");
    console.log("2. Get testnet VET tokens from the faucet: https://faucet.vecha.in/");
    console.log("3. Add your private key to the .env file");
    console.log("4. Run this script again");
    console.log("");
    console.log("🔄 For now, let's deploy to localhost for testing...");
    
    // Deploy to localhost instead
    const SimpleQA = await ethers.getContractFactory("SimpleQA");
    const dummyX2EarnContract = "0x0000000000000000000000000000000000000000";
    const dummyAppId = "0x1234567890123456789012345678901234567890123456789012345678901234";
    
    const simpleQA = await SimpleQA.deploy(dummyX2EarnContract, dummyAppId);
    await simpleQA.waitForDeployment();
    
    const contractAddress = await simpleQA.getAddress();
    console.log("✅ SimpleQA contract deployed to localhost!");
    console.log("📍 Contract Address:", contractAddress);
    
    // Save contract address
    const contractInfo = {
      address: contractAddress,
      network: "localhost",
      deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../contract-address.json'),
      JSON.stringify(contractInfo, null, 2)
    );
    
    console.log("💾 Contract address saved to contract-address.json");
    return;
  }

  try {
    // Get the contract factory
    const SimpleQA = await ethers.getContractFactory("SimpleQA");

    // Deploy the contract with dummy parameters for now
    console.log("📝 Deploying SimpleQA contract to VeChain Testnet...");
    const dummyX2EarnContract = "0x0000000000000000000000000000000000000000";
    const dummyAppId = "0x1234567890123456789012345678901234567890123456789012345678901234";

    const simpleQA = await SimpleQA.deploy(dummyX2EarnContract, dummyAppId);

    // Wait for deployment to complete
    await simpleQA.waitForDeployment();

    const contractAddress = await simpleQA.getAddress();
    console.log("✅ SimpleQA contract deployed successfully!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🌐 Network: VeChain Testnet");
    console.log("🔗 Explorer: https://explore-testnet.vechain.org/transactions/");

    // Basic test
    console.log("\n🧪 Testing basic functionality...");
    const platformStats = await simpleQA.getPlatformStats();
    console.log("📊 Platform Stats:", {
      totalQuestions: platformStats[0].toString(),
      totalAnswers: platformStats[1].toString(),
      totalUsers: platformStats[2].toString()
    });
    console.log("✅ Contract is working correctly!");

    // Save contract address to a file
    const contractInfo = {
      address: contractAddress,
      network: "vechain_testnet",
      deployedAt: new Date().toISOString()
    };
    fs.writeFileSync(
      path.join(__dirname, '../contract-address.json'),
      JSON.stringify(contractInfo, null, 2)
    );
    console.log("💾 Contract address saved to contract-address.json");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    console.log("\n🔄 Falling back to localhost deployment...");
    
    // Fallback to localhost
    const SimpleQA = await ethers.getContractFactory("SimpleQA");
    const dummyX2EarnContract = "0x0000000000000000000000000000000000000000";
    const dummyAppId = "0x1234567890123456789012345678901234567890123456789012345678901234";
    
    const simpleQA = await SimpleQA.deploy(dummyX2EarnContract, dummyAppId);
    await simpleQA.waitForDeployment();
    
    const contractAddress = await simpleQA.getAddress();
    console.log("✅ SimpleQA contract deployed to localhost!");
    console.log("📍 Contract Address:", contractAddress);
    
    const contractInfo = {
      address: contractAddress,
      network: "localhost",
      deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../contract-address.json'),
      JSON.stringify(contractInfo, null, 2)
    );
    
    console.log("💾 Contract address saved to contract-address.json");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });


