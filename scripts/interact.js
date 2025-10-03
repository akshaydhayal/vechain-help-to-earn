const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  // Load deployment info
  let deploymentInfo;
  try {
    const deploymentData = fs.readFileSync('deployment-info.json', 'utf8');
    deploymentInfo = JSON.parse(deploymentData);
  } catch (error) {
    console.error("❌ Could not load deployment info. Please deploy the contract first.");
    process.exit(1);
  }
  
  const contractAddress = deploymentInfo.contractAddress;
  console.log("🔗 Interacting with BuyMeACoffee contract at:", contractAddress);
  
  // Get contract instance
  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  const contract = BuyMeACoffee.attach(contractAddress);
  
  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("👤 Using account:", signer.address);
  
  try {
    // Get contract info
    console.log("\n📊 Contract Information:");
    const sales = await contract.getSales();
    const contractBalance = await ethers.provider.getBalance(contractAddress);
    console.log("   Owner:", deploymentInfo.contractInfo.owner);
    console.log("   Total Sales:", sales.length);
    console.log("   Contract Balance:", ethers.formatEther(contractBalance), "VET");
    
    // Get signer's VET balance
    const signerBalance = await ethers.provider.getBalance(signer.address);
    console.log("\n💰 Your VET Balance:", ethers.formatEther(signerBalance), "VET");
    
    // Example interactions
    console.log("\n🧪 Example Interactions:");
    
    // 1. Buy coffee for the owner
    console.log("   1. Buying coffee for the owner...");
    try {
      const buyCoffeeTx = await contract.buyCoffee(
        "Test User", 
        "Thanks for the great work! ☕",
        { value: ethers.parseEther("0.1") } // Send 0.1 VET
      );
      await buyCoffeeTx.wait();
      console.log("   ✅ Coffee purchase successful! TX:", buyCoffeeTx.hash);
    } catch (error) {
      console.log("   ⚠️  Coffee purchase failed:", error.message);
    }
    
    // 2. Send coffee to a specific address
    console.log("   2. Sending coffee to a specific address...");
    const testAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"; // Example address
    try {
      const sendCoffeeTx = await contract.sendCoffee(
        testAddress,
        "Test User",
        "Enjoy your coffee! ☕",
        { value: ethers.parseEther("0.05") } // Send 0.05 VET
      );
      await sendCoffeeTx.wait();
      console.log("   ✅ Coffee sent successfully! TX:", sendCoffeeTx.hash);
    } catch (error) {
      console.log("   ⚠️  Coffee send failed (this is normal if address is invalid):", error.message);
    }
    
    // 3. Get updated sales
    console.log("   3. Fetching updated sales...");
    const updatedSales = await contract.getSales();
    console.log("   📈 Total Sales Now:", updatedSales.length);
    
    if (updatedSales.length > 0) {
      const latestSale = updatedSales[updatedSales.length - 1];
      console.log("   ☕ Latest Sale:");
      console.log("     From:", latestSale.from);
      console.log("     To:", latestSale.to);
      console.log("     Value:", ethers.formatEther(latestSale.value), "VET");
      console.log("     Name:", latestSale.name);
      console.log("     Message:", latestSale.message);
      console.log("     Timestamp:", new Date(Number(latestSale.timestamp) * 1000).toLocaleString());
    }
    
    // 4. Check final balances
    const finalContractBalance = await ethers.provider.getBalance(contractAddress);
    const finalSignerBalance = await ethers.provider.getBalance(signer.address);
    console.log("\n💰 Final Balances:");
    console.log("   Contract Balance:", ethers.formatEther(finalContractBalance), "VET");
    console.log("   Your VET Balance:", ethers.formatEther(finalSignerBalance), "VET");
    
    // 5. Show all sales
    if (updatedSales.length > 0) {
      console.log("\n📋 All Coffee Sales:");
      updatedSales.forEach((sale, index) => {
        console.log(`   ${index + 1}. ${sale.name}: "${sale.message}" (${ethers.formatEther(sale.value)} VET)`);
      });
    }
    
  } catch (error) {
    console.error("❌ Interaction failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
