/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import "dotenv/config"

module.exports = {
  apiExporter: {
    path: "./abi",
    clear: true,
    flat: true,
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
