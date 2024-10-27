import { deployments, ethers, getNamedAccounts } from "hardhat";
import { expect } from "chai";
import { InFlameInsurancePolicyNFT, InFlameInsuranceVault, TestToken } from "../typechain";

describe("InFlame Contracts", function () {
  let deployer: string;
  let insurancePolicyNFT: InFlameInsurancePolicyNFT;
  let insuranceVault: InFlameInsuranceVault;
  let testToken: TestToken;
  const initialSupply: number = 1000000;

  before(async function () {
    const accounts = await getNamedAccounts();
    deployer = accounts.deployer;

    await deployments.fixture(["InFlame"]);

    // Get deployed contracts
    insurancePolicyNFT = await ethers.getContract("InFlameInsurancePolicyNFT", deployer);
    insuranceVault = await ethers.getContract("InFlameInsuranceVault", deployer);
    testToken = await ethers.getContract("TestToken", deployer);
  });

  describe("TestToken", function () {
    it("should deploy with correct initial supply", async function () {
      expect(await testToken.totalSupply()).to.equal(initialSupply * 10 ** 18);
      expect(await testToken.balanceOf(deployer)).to.equal(initialSupply * 10 ** 18);
    });
  });

  describe("InFlameInsuranceVault", function () {
    it("should allow deposits", async function () {
      await testToken.approve(insuranceVault.address, 1000);
      await insuranceVault.deposit(1000);

      expect(await testToken.balanceOf(insuranceVault.address)).to.equal(1000);
      expect(await insuranceVault.balances(deployer)).to.equal(1000);
    });

    it("should process payouts correctly", async function () {
      await testToken.approve(insuranceVault.address, 2000);
      await insuranceVault.deposit(2000);

      await insuranceVault.processPayout(1, deployer); // This will call the payout logic

      expect(await testToken.balanceOf(deployer)).to.equal(initialSupply * 10 ** 18 - 1000);
    });
  });

  describe("InFlameInsurancePolicyNFT", function () {
    it("should allow issuing a policy", async function () {
      await testToken.approve(insurancePolicyNFT.address, 100);
      await insurancePolicyNFT.issuePolicy(deployer, 10000, "123 Fake St", insuranceVault.address);

      expect(await insurancePolicyNFT.ownerOf(1)).to.equal(deployer);
    });

    it("should allow renewing a policy", async function () {
      await testToken.approve(insurancePolicyNFT.address, 100);
      await insurancePolicyNFT.renewPolicy(1);

      expect(await insurancePolicyNFT.userExpires(1)).to.be.gt(0);
    });

    it("should initiate a claim correctly", async function () {
      await testToken.approve(insurancePolicyNFT.address, 100);
      await insurancePolicyNFT.issuePolicy(deployer, 10000, "123 Fake St", insuranceVault.address);

      await expect(insurancePolicyNFT.claimInsurance(1, "Test claim"))
        .to.emit(insurancePolicyNFT, "ClaimInitiated")
        .withArgs(1, deployer);
    });
  });
});
