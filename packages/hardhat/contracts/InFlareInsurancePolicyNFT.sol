// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./utils/ERC4907.sol";

contract InFlameInsurancePolicyNFT is ERC4907, Ownable {
	struct PolicyDetails {
		uint256 houseValue;
		string houseAddress;
		uint256 monthlyRate;
		address policyHolder; // Address of the policy holder
		uint64 expiration; // Expiration timestamp of the policy
	}

	mapping(uint256 => PolicyDetails) public policies;
	uint256 private _nextTokenId;

	event PolicyIssued(uint256 tokenId, address owner, uint64 expiration);
	event ClaimInitiated(uint256 tokenId, address claimant);
	event ClaimVerified(uint256 tokenId, bool isValid);
	event PayoutProcessed(uint256 tokenId, address claimant, uint256 amount);

	constructor() ERC4907("InFlameInsuranceNFT", "IFNFT") {}

	function issuePolicy(
		address to,
		uint256 houseValue,
		string memory houseAddress
	) external payable {
		require(msg.value > 0, "Must send ETH to issue a policy");

		uint256 monthlyRate = (houseValue * 83) / 1000; // Fixed multiplication
		require(msg.value >= monthlyRate, "Insufficient ETH sent");

		uint256 tokenId = _nextTokenId++;
		_mint(to, tokenId);

		uint64 expiration = uint64(block.timestamp + 30 days);
		setUser(tokenId, to, expiration); // Use the ERC4907 function

		policies[tokenId] = PolicyDetails({
			houseValue: houseValue,
			houseAddress: houseAddress,
			monthlyRate: monthlyRate,
			policyHolder: to,
			expiration: expiration
		});

		emit PolicyIssued(tokenId, to, expiration);
	}

	function renewPolicy(uint256 tokenId) external payable {
		require(ownerOf(tokenId) == msg.sender, "Not policy owner");
		uint256 monthlyRate = policies[tokenId].monthlyRate;

		require(msg.value >= monthlyRate, "Insufficient ETH sent for renewal");

		uint64 newExpiration = uint64(block.timestamp + 30 days);
		setUser(tokenId, msg.sender, newExpiration); // Use the ERC4907 function

		// Funds are kept in the contract, no vault to transfer to
		emit PolicyIssued(tokenId, msg.sender, newExpiration);
	}

	function claimInsurance(uint256 tokenId) external {
		require(ownerOf(tokenId) == msg.sender, "Only policy owner can claim");
		require(userExpires(tokenId) > block.timestamp, "Policy expired");

		emit ClaimInitiated(tokenId, msg.sender);

		// Dummy verification logic - implement your own as needed
		bool isValidClaim = true; // Placeholder for real claim verification

		emit ClaimVerified(tokenId, isValidClaim);

		if (isValidClaim) {
			uint256 payoutAmount = policies[tokenId].monthlyRate; // Example payout logic
			require(
				address(this).balance >= payoutAmount,
				"Insufficient balance for payout"
			);

			(bool payoutSent, ) = msg.sender.call{ value: payoutAmount }("");
			require(payoutSent, "Payout transfer failed");

			emit PayoutProcessed(tokenId, msg.sender, payoutAmount);
		} else {
			revert("Claim verification failed");
		}
	}

	// Function to withdraw contract balance for the owner (optional)
	function withdraw(uint256 amount) external onlyOwner {
		require(address(this).balance >= amount, "Insufficient balance");
		(bool sent, ) = msg.sender.call{ value: amount }("");
		require(sent, "Withdrawal failed");
	}
}
