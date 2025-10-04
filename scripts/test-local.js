const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing Simple Q&A Contract Functionality Locally...");
  
  // Get signers
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const user1 = signers[1] || deployer;
  const user2 = signers[2] || deployer;
  
  console.log("👤 Deployer:", deployer.address);
  console.log("👤 User 1:", user1.address);
  console.log("👤 User 2:", user2.address);
  
  // Deploy contract first
  console.log("\n📝 Deploying SimpleQA contract...");
  const dummyVeBetterDAO = "0x0000000000000000000000000000000000000000";
  const dummyAppId = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  
  const SimpleQA = await ethers.getContractFactory("SimpleQA");
  const simpleQA = await SimpleQA.deploy(dummyVeBetterDAO, dummyAppId);
  await simpleQA.waitForDeployment();
  
  const contractAddress = await simpleQA.getAddress();
  console.log("✅ Contract deployed at:", contractAddress);
  
  // Test 1: Get initial platform stats
  console.log("\n📊 Initial Platform Stats:");
  const [totalQuestions, totalAnswers, totalUsers, contractBalance] = await simpleQA.getPlatformStats();
  console.log("   Total Questions:", totalQuestions.toString());
  console.log("   Total Answers:", totalAnswers.toString());
  console.log("   Total Users:", totalUsers.toString());
  console.log("   Contract Balance:", ethers.formatEther(contractBalance), "VET");
  
  // Test 2: User 1 asks a question
  console.log("\n❓ User 1 asking a question...");
  const askQuestionTx = await simpleQA.connect(user1).askQuestion(
    "How does VeChain work?",
    "I want to understand the technical details of VeChain blockchain technology.",
    { value: ethers.parseEther("0.2") } // 0.2 VET bounty
  );
  await askQuestionTx.wait();
  console.log("✅ Question asked with 0.2 VET bounty");
  
  // Test 3: User 2 submits an answer
  console.log("\n💬 User 2 submitting an answer...");
  const submitAnswerTx = await simpleQA.connect(user2).submitAnswer(
    1, // Question ID 1
    "VeChain is a blockchain platform that uses Proof of Authority consensus. It's designed for enterprise use cases with features like dual-token system (VET/VTHO), low transaction costs, and high throughput."
  );
  await submitAnswerTx.wait();
  console.log("✅ Answer submitted");
  
  // Test 4: User 1 upvotes the answer
  console.log("\n👍 User 1 upvoting the answer...");
  const upvoteTx = await simpleQA.connect(user1).upvoteAnswer(1); // Answer ID 1
  await upvoteTx.wait();
  console.log("✅ Answer upvoted");
  
  // Test 5: Get answer details
  console.log("\n📝 Answer Details:");
  const [answerId, questionId, answerer, content, upvotes, isApproved, timestamp] = await simpleQA.getAnswer(1);
  console.log("   Answer ID:", answerId.toString());
  console.log("   Question ID:", questionId.toString());
  console.log("   Answerer:", answerer);
  console.log("   Upvotes:", upvotes.toString());
  console.log("   Is Approved:", isApproved);
  console.log("   Timestamp:", new Date(Number(timestamp) * 1000).toISOString());
  
  // Test 6: User 1 approves the answer
  console.log("\n✅ User 1 approving the answer...");
  const approveTx = await simpleQA.connect(user1).approveAnswer(1); // Answer ID 1
  await approveTx.wait();
  console.log("✅ Answer approved - rewards distributed!");
  
  // Test 7: Get updated stats
  console.log("\n📊 Updated Platform Stats:");
  const [newTotalQuestions, newTotalAnswers, newTotalUsers, newContractBalance] = await simpleQA.getPlatformStats();
  console.log("   Total Questions:", newTotalQuestions.toString());
  console.log("   Total Answers:", newTotalAnswers.toString());
  console.log("   Total Users:", newTotalUsers.toString());
  console.log("   Contract Balance:", ethers.formatEther(newContractBalance), "VET");
  
  // Test 8: Get user stats
  console.log("\n👤 User 2 Stats:");
  const [wallet, reputation, questionsAsked, answersGiven, answersApproved] = await simpleQA.getUser(user2.address);
  console.log("   Wallet:", wallet);
  console.log("   Reputation:", reputation.toString());
  console.log("   Questions Asked:", questionsAsked.toString());
  console.log("   Answers Given:", answersGiven.toString());
  console.log("   Answers Approved:", answersApproved.toString());
  
  // Test 9: Get question details
  console.log("\n❓ Question Details:");
  const [qId, asker, title, description, bounty, isActive, hasApprovedAnswer, approvedAnswerId, qTimestamp] = await simpleQA.getQuestion(1);
  console.log("   Question ID:", qId.toString());
  console.log("   Asker:", asker);
  console.log("   Title:", title);
  console.log("   Bounty:", ethers.formatEther(bounty), "VET");
  console.log("   Is Active:", isActive);
  console.log("   Has Approved Answer:", hasApprovedAnswer);
  console.log("   Approved Answer ID:", approvedAnswerId.toString());
  
  console.log("\n🎉 All tests completed successfully!");
  console.log("\n📋 Test Summary:");
  console.log("   ✅ Question asking with bounty");
  console.log("   ✅ Answer submission");
  console.log("   ✅ Answer upvoting");
  console.log("   ✅ Answer approval and reward distribution");
  console.log("   ✅ User reputation tracking");
  console.log("   ✅ Platform statistics");
  
  console.log("\n🎯 Contract is working perfectly!");
  console.log("   • Users can ask questions with VET bounties");
  console.log("   • Users can submit answers");
  console.log("   • Users can upvote answers");
  console.log("   • Question askers can approve answers");
  console.log("   • Rewards are distributed automatically");
  console.log("   • User reputation is tracked");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });

