import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployWithAA } from "../utils/deployWithAA";

/**
 * Deploys an ERC20 token contract named "EarthToken" using a smart account associated to SIGNING_KEY, if provided,
 * or else a random signing key will be used
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
export const CONTRACT_NAME = "EarthToken";
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const factory = await hre.ethers.getContractFactory(CONTRACT_NAME);

  // use account abstraction to deploy the contract, with the gas sponsored for us!
  const tokenAddress = await deployWithAA(factory, CONTRACT_NAME, hre);
  console.log("👋 Token contract deployed to:", tokenAddress);

  const token = await hre.ethers.getContractAt(CONTRACT_NAME, tokenAddress);
  console.log("👋 Token name:", await token.name());
  console.log("👋 Token symbol:", await token.symbol());
  console.log("👋 Token decimals:", await token.decimals());
  console.log("👋 Maximum mint amount:", await token.MAX_MINT_AMOUNT());
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Token
deployYourContract.tags = ["Token"];