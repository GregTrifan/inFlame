// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract InFlameInsuranceVault is Ownable {
	mapping(address => uint256) public balances; // Can be used if needed for tracking
	event Deposit(address indexed sender, uint256 amount);
	event Payout(
		uint256 indexed tokenId,
		address indexed claimant,
		uint256 amount
	);

	constructor() {}

	function deposit() external payable {
		require(msg.value > 0, "Must send ETH to deposit");
		balances[msg.sender] += msg.value; // Track user deposits
		emit Deposit(msg.sender, msg.value);
	}

	function processPayout(
		uint256 tokenId,
		address claimant
	) external onlyOwner {
		uint256 payoutAmount = calculatePayout(tokenId); // Add your payout calculation logic
		require(
			address(this).balance >= payoutAmount,
			"Insufficient funds in vault"
		);

		// Transfer payout to claimant
		(bool success, ) = claimant.call{ value: payoutAmount }("");
		require(success, "Payout transfer failed");

		emit Payout(tokenId, claimant, payoutAmount);
	}

	function calculatePayout(uint256 tokenId) internal view returns (uint256) {
		// Example payout logic; replace with your actual calculation
		return 50 * 10 ** 18; // Example fixed payout for demo purposes (50 wei)
	}

	// Withdraw funds from the vault (only for the owner, e.g., for audits or emergencies)
	function withdraw(uint256 amount) external onlyOwner {
		require(
			amount <= address(this).balance,
			"Insufficient balance in vault"
		);
		(bool success, ) = msg.sender.call{ value: amount }("");
		require(success, "Withdraw failed");
	}
}
