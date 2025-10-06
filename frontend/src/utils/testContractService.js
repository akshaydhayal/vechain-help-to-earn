// Test script to verify contract service works
import { ABIContract } from "@vechain/sdk-core";
import { ThorClient } from "@vechain/sdk-network";
import { contractAbi } from './contractAbi.js';

const thor = ThorClient.at("https://testnet.vechain.org");
const abi = new ABIContract(contractAbi);
const contractAddress = "0x25d137e1d0bf7f135706803cd7722946e483aecf";

async function testContractService() {
  console.log('🧪 Testing VeChain Contract Service...');
  
  try {
    // Test 1: Get platform stats
    console.log('\n1. Testing getPlatformStats...');
    const statsResult = await thor.contracts.executeCall(
      contractAddress,
      abi.getFunction("getPlatformStats"),
      []
    );
    console.log('Platform Stats:', statsResult);
    
    // Test 2: Get question counter
    console.log('\n2. Testing questionCounter...');
    const questionCounterResult = await thor.contracts.executeCall(
      contractAddress,
      abi.getFunction("questionCounter"),
      []
    );
    console.log('Question Counter:', questionCounterResult);
    
    // Test 3: Get answer counter
    console.log('\n3. Testing answerCounter...');
    const answerCounterResult = await thor.contracts.executeCall(
      contractAddress,
      abi.getFunction("answerCounter"),
      []
    );
    console.log('Answer Counter:', answerCounterResult);
    
    // Test 4: Get first question
    console.log('\n4. Testing getQuestion(1)...');
    const questionResult = await thor.contracts.executeCall(
      contractAddress,
      abi.getFunction("getQuestion"),
      ["1"]
    );
    console.log('Question 1:', questionResult);
    
    // Test 5: Get first answer
    console.log('\n5. Testing getAnswer(1)...');
    const answerResult = await thor.contracts.executeCall(
      contractAddress,
      abi.getFunction("getAnswer"),
      ["1"]
    );
    console.log('Answer 1:', answerResult);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testContractService();
