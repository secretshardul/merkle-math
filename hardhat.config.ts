import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-abi-exporter'
import * as dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  // https://hardhat.org/hardhat-network/docs/metamask-issue
  networks: {
    hardhat: {
      chainId: 1337
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY!]
    },
    cronos_testnet: {
      url: "https://evm-t3.cronos.org/",
      chainId: 338,
      accounts: [process.env.PRIVATE_KEY!]
    },
    shardeum_testnet: {
      url: "	https://liberty10.shardeum.org/",
      chainId: 8080,
      accounts: [process.env.PRIVATE_KEY!]
    },
  },
  mocha: {
    timeout: 100000000
  }
};

export default config;
