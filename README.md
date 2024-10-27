# inFlame - built with 🏗 Scaffold-ETH 2

InFlame is a proof-of-concept house insurance app where users can protect their property with a subscription tied to an ERC4907 NFT. Through Flare's Data Connector (FDC), we aim to automate verification and approval/denial of insurance claims, pulling data from a reputable source (and for demo purposes, we’re mostly saying “yes” to claims for now! ^^).

## Technical Overview

The inFlame insurance platform uses smart contracts and oracles to implement a decentralized house insurance model on Flare, enhanced by Flare's Data Connector (FDC) for reliable claim verification.

#### Core Components

##### Insurance Policy Contract (InFlameInsurancePolicyNFT):

ERC4907 NFT: Policies are represented as NFTs that store user-specific insurance details such as house value, address, monthly premium rate, and policy expiration.
Policy Issuance: Users issue a policy by sending ETH (calculated as a monthly rate based on 0.083% of the house value), which generates a new policy NFT.
Policy Renewal: Policies can be renewed monthly; the contract verifies ownership and funds before extending the expiration.
Claims Processing:
Users can initiate a claim if the policy is active. Claims are validated through the FDC, which checks against curated data sources.
Verified claims are emitted with events for further processing by the InFlameInsuranceVault.

##### Insurance Vault Contract (InFlameInsuranceVault):

ETH Deposit Management: Holds funds to process verified claims. Balances are tracked and can be withdrawn by the contract owner as needed.
Claim Payouts: Calculates and distributes funds to claimants based on validation. Payout amounts are based on policy-specific data or preset calculations for this proof-of-concept.

##### Flare Data Connector (FDC) Integration

Claim Validation: When a user initiates a claim, the FDC consults designated data sources to confirm the details (e.g., house value, damage reports, or relevant news).
Oracle Integration: The FDC could be extended to work with optimistic oracles (such as UMA) for further validation layers or for claim disputes, integrating off-chain data and enhancing trust in the verification process.

## Our next steps

Although within the ETHLondon '24 schedule we didn't manage to have too many features/verification layers going on in the app, we'd love to keep going with this project and:

1. Add claim verification by voters using an Optimistic Oracle like UMA, with status updates bridged via FDC.
2. Curate trusted data sources for claim validation and to auto-assess property value.
3. Check eligibility for new policies based on data provided by the user.
4. Set up automated claim payouts based on damage estimates, using UMA oracles for extra support.

## Quickstart

To get started with inFlame, follow the steps below:

1. install dependencies

```
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.
