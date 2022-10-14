# David Contracts
Hi David,

Inside the folder `contracts_original` are a series of contracts provided to us from a team working on another projects.

Inside the folder `contracts_deployed` are the same contracts slightly modified, but deployed on Rinkeby testnet.

What we require from you is:

1. Confirm code is functioning as intended
2. Full test the entire flow of the code
3. Provide a simple working web3 front-end so that we can also test the contracts on testnet
4. Audit the security of the code

## Overview
We would like to create two tokens, one primary ERC-20 token `$SWORD` and another non-tradable token `$SHARD`.

We would like to create two staking pool that receives two different tokens:

	1. $SWORD / ETH Uniswap V2 LP tokens
	2. $SWORD tokens

Each token will reward a specific % rate of `$SHARD` over time.

The user should be able to unstake and received their deposit and their `$SHARD` reward.

The user will be able to view and redeem NFTs for `$SHARD` token on OpenSea.


## Contracts Deployed
The folder `contracts_deployed` has been deployed on Rinkeby testnet but has not yet been tested or verified to work properly.

They exist at the following addresses:

### Pool
• Uniswap LP pool 👉 https://app.uniswap.org/#/add/v2/0x99BB38c25711ac1915FD0E9781ddBC421Fc0f625/ETH

• Stake Pool Factory contract 👉 https://rinkeby.etherscan.io/address/0x9DEb8Ab54fDd3a8c0b167cBc4A12D5CB04324EfB#code

• NFT redemption contract 👉  `0x3e8c298d0b713774ea2d634838c0361b291e6119`

### Tokens
• $SWORD ERC-20 contract 👉 `0x99BB38c25711ac1915FD0E9781ddBC421Fc0f625`

• $SHARD ERC-20 non-tradable contract 👉 `0xf94c3566376600bbf6d9f196b677572d218a885e`

### NFTs
• NFT ERC-721 Contract 👉 `0x0F0fb5E52a48Cd070d2B1824a6ea2D6A2D479E47`

• Opensea visualzation of ERC-721 contract: https://testnets.opensea.io/collection/swordnft


Please let us know if you have any questions.
