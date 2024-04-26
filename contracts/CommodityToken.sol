// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CommodityToken
 * @dev Implementation of the ERC20 Token standard with an addition of commodity backing.
 * This token is intended to be used in a yield farming context where users can stake these
 * tokens to earn yield in another asset. It incorporates the Ownable contract to ensure that
 * token minting and burning can only be performed by the contract owner.
 */
contract CommodityToken is ERC20, Ownable {
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param initialSupply The amount of the token to mint on creation.
     */
    constructor(string memory name, string memory symbol, uint256 initialSupply)
        ERC20(name, symbol) Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Function to mint tokens. This function can only be called by the contract owner.
     * This allows new tokens to be created but should be controlled to not deflate the existing token value.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Function to burn tokens. This decreases the supply of tokens and represents the removal of the commodity backing.
     * @param from The address from which tokens will be burned.
     * @param amount The amount of tokens to burn.
     */
    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
