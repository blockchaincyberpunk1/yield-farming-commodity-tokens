# Yield Farming Commodity Tokens

This directory contains the smart contracts for the Yield Farming Commodity Tokens project. These contracts facilitate the staking of commodity-backed tokens and the distribution of yield to users.

## Summary

The project consists of two main smart contracts:

1. **CommodityToken.sol**: This contract implements the ERC20 Token standard with an additional feature of commodity backing. It allows for the creation of tokens backed by a commodity, intended for use in a yield farming context. The contract owner can mint and burn tokens, controlling the token supply.

2. **YieldFarming.sol**: This contract manages the staking of tokens and the distribution of yield to stakers. Users can stake commodity-backed tokens and earn yield in another asset. The contract owner can distribute rewards to stakers based on their staking balances.

## Setup and Usage

1. Deploy the `CommodityToken` contract to create commodity-backed tokens.
2. Deploy the `YieldFarming` contract, passing the addresses of the staking token and reward token as constructor arguments.
3. Users can stake tokens using the `stake` function and withdraw them using the `unstake` function.
4. The contract owner can distribute rewards to stakers using the `distributeRewards` function.

Ensure that the staking and reward tokens are deployed and accessible to the `YieldFarming` contract.

## Smart Contracts

- **CommodityToken.sol**: Implements ERC20 with commodity backing, allowing for token minting and burning.
- **YieldFarming.sol**: Manages token staking and yield distribution, allowing users to stake tokens and earn rewards.

## License

The smart contracts are provided under the MIT License. See individual files for details.
