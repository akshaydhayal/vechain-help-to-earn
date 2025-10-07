const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SimpleQA contract...");

  // Get the contract factory
  const SimpleQA = await ethers.getContractFactory("SimpleQA");

  // Deploy the contract
  const simpleQA = await SimpleQA.deploy();

  await simpleQA.waitForDeployment();

  const contractAddress = await simpleQA.getAddress();
  console.log("SimpleQA deployed to:", contractAddress);
  console.log("Contract address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
