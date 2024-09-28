import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    polygonAmoy: {
      url: process.env.AMOY_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      accounts: [process.env.PRIVATE_KEY!], // Your wallet private key
      chainId: 80002, // Sepolia chain ID
    },
  },
};

export default config;
