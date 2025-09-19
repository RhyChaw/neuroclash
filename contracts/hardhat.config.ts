import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.24",
		settings: { optimizer: { enabled: true, runs: 200 } }
	},
	networks: {
		// configured later via env
	},
	typechain: {
		outDir: "typechain-types",
		target: "ethers-v6",
	},
};

export default config;
