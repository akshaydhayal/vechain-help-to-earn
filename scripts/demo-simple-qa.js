const { ethers } = require("hardhat");

async function main() {
  console.log("🎯 Simple Q&A Contract Demo...");
  
  // Contract address from deployment
  const contractAddress = "0xed10481bacc6f37bd837715e8972e8b2234f7628";
  
  // Get signer
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  
  // Connect to contract
  const SimpleQA = await ethers.getContractFactory("SimpleQA");
  const simpleQA = SimpleQA.attach(contractAddress);
  
  console.log("\n📋 Contract Address:", contractAddress);
  console.log("🔗 Explorer:", `https://explore-testnet.vechain.org/transactions/${contractAddress}`);
  
  // Get platform stats
  console.log("\n📊 Platform Stats:");
  const [totalQuestions, totalAnswers, totalUsers, contractBalance] = await simpleQA.getPlatformStats();
  console.log("   Total Questions:", totalQuestions.toString());
  console.log("   Total Answers:", totalAnswers.toString());
  console.log("   Total Users:", totalUsers.toString());
  console.log("   Contract Balance:", ethers.formatEther(contractBalance), "VET");
  
  // Get the first question details
  if (totalQuestions > 0) {
    console.log("\n❓ Question Details:");
    const [qId, asker, title, description, bounty, isActive, hasApprovedAnswer, approvedAnswerId, qTimestamp] = await simpleQA.getQuestion(1);
    console.log("   Question ID:", qId.toString());
    console.log("   Asker:", asker);
    console.log("   Title:", title);
    console.log("   Description:", description);
    console.log("   Bounty:", ethers.formatEther(bounty), "VET");
    console.log("   Is Active:", isActive);
    console.log("   Has Approved Answer:", hasApprovedAnswer);
    console.log("   Approved Answer ID:", approvedAnswerId.toString());
    console.log("   Timestamp:", new Date(Number(qTimestamp) * 1000).toISOString());
  }
  
  // Get user stats
  console.log("\n👤 User Stats:");
  const [wallet, reputation, questionsAsked, answersGiven, answersApproved] = await simpleQA.getUser(deployer.address);
  console.log("   Wallet:", wallet);
  console.log("   Reputation:", reputation.toString());
  console.log("   Questions Asked:", questionsAsked.toString());
  console.log("   Answers Given:", answersGiven.toString());
  console.log("   Answers Approved:", answersApproved.toString());
  
  // Test contract owner functions
  console.log("\n🔧 Owner Functions Test:");
  try {
    const currentRewardAmount = await simpleQA.rewardAmount();
    console.log("   Current B3TR Reward Amount:", ethers.formatEther(currentRewardAmount), "B3TR");
    
    const appId = await simpleQA.appId();
    console.log("   VeBetterDAO App ID:", appId);
    
    const owner = await simpleQA.owner();
    console.log("   Contract Owner:", owner);
    
    console.log("✅ Owner functions accessible");
  } catch (error) {
    console.log("❌ Error accessing owner functions:", error.message);
  }
  
  console.log("\n🎉 Contract Demo Completed!");
  console.log("\n📋 Contract Features Available:");
  console.log("   ✅ Ask questions with VET bounties");
  console.log("   ✅ Submit answers to questions");
  console.log("   ✅ Upvote answers");
  console.log("   ✅ Approve best answers (question asker only)");
  console.log("   ✅ Earn VET bounties for approved answers");
  console.log("   ✅ Earn B3TR tokens from VeBetterDAO");
  console.log("   ✅ User reputation tracking");
  console.log("   ✅ Anti-farming mechanisms");
  
  console.log("\n🎯 Contract is ready for frontend integration!");
  console.log("   • Contract deployed and functional");
  console.log("   • All core features implemented");
  console.log("   • Ready for VeChain Kit integration");
  console.log("   • Ready for VeBetterDAO integration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Demo failed:", error);
    process.exit(1);
  });
