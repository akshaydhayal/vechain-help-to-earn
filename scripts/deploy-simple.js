const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Simple Test Contract Deployment...");
  
  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "VET");
  
  // Deploy SimpleTest contract
  console.log("\n📝 Deploying SimpleTest contract...");
  const SimpleTest = await ethers.getContractFactory("SimpleTest");
  const simpleTest = await SimpleTest.deploy();
  await simpleTest.waitForDeployment();
  
  const contractAddress = await simpleTest.getAddress();
  console.log("✅ SimpleTest deployed at:", contractAddress);
  
  // Test the contract
  console.log("\n🧪 Testing contract...");
  const message = await simpleTest.getMessage();
  console.log("📝 Initial message:", message);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    network: "vechain_testnet",
    contractType: "SimpleTest",
    explorerUrl: `https://explore-testnet.vechain.org/transactions/${contractAddress}`
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment-info.json");
  
  console.log("\n🎉 Simple contract deployed successfully!");
  console.log("🔗 VeChain Testnet Explorer:", `https://explore-testnet.vechain.org/transactions/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
