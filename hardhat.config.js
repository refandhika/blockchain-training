require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require('@nomicfoundation/hardhat-chai-matchers')
require('@nomicfoundation/hardhat-ethers')
require('@typechain/hardhat')
require("hardhat-deploy")
require("hardhat-deploy-ethers")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_URL = process.env.ETHERSCAN_URL || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
  solidity: {
    compilers: [
      { version: "0.8.24" },
      { version: "0.7.0" } // Sample of multi compiler
    ]
  },
  etherscan: {
    url: ETHERSCAN_URL,
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: true,
    outputFiles: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC"
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    user: {
      default: 1
    }
  }
}
