import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployInFlameContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the ERC20 Test Token for payments
  await deploy("TestToken", {
    from: deployer,
    args: [10000000], // Initial supply of 1,000,000 tokens
    log: true,
  });

  // Deploy the InFlameInsuranceVault contract
  const vault = await deploy("InFlameInsuranceVault", {
    from: deployer,
    args: [], // Pass the ERC20 token address
    log: true,
  });

  // Deploy the InFlameInsurancePolicyNFT contract
  const insuranceNFT = await deploy("InFlameInsurancePolicyNFT", {
    from: deployer,
    args: [], // Pass vault address and ERC20 token address
    log: true,
  });

  // Get deployed contracts to interact with them
  //const insurancePolicyNFT = await hre.ethers.getContract<Contract>("InFlameInsurancePolicyNFT", deployer);
  console.log("👋 InFlame Insurance Policy NFT deployed at:", insuranceNFT.address);
  //const insuranceVault = await hre.ethers.getContract<Contract>("InFlameInsuranceVault", deployer);
  console.log("👋 InFlame Insurance Vault deployed at:", vault.address);
};

export default deployInFlameContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags InFlame
deployInFlameContracts.tags = ["InFlame"];
