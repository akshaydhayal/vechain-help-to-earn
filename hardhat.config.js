require("@nomicfoundation/hardhat-toolbox");
require("@vechain/sdk-hardhat-plugin");

// Load environment variables
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    vechain_testnet: {
      url: "https://testnet.vechain.org",
      accounts: ["9dd489bda0d66bcba0d8e36057cb3a570e6197ab5a88e56b495f5cba71e83922"],
      chainId: 39,
      gas: 10000000,
      gasPrice: 1000000000
    },
    vechain_mainnet: {
      url: "https://mainnet.vechain.org", 
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== 'your_private_key_here') ? [process.env.PRIVATE_KEY] : [],
      chainId: 74,
      gas: 10000000,
      gasPrice: 1000000000
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
