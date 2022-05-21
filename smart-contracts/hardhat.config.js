require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers")
require("dotenv").config();

const url = process.env.TESTNET_RPC;
const accounts = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.10",
  networks: {
    mumbai: {
      url: url,
      accounts: [accounts],
      gas: 6000000,           // Gas sent with each transaction (default: ~6700000)
      gasPrice: 3000000000,  // 3 gwei (in wei) (default: 100 gwei)
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
};