// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract EarthToken is ERC20 {
    // EarthPass NFT contract address on Base Sepolia
    address public constant EARTHPASS_NFT_ADDRESS = 0x94ff63e2967E23CA39af55D57bf2d6654f71ED86;

    // Maximum tokens that can be minted at once
    uint256 public constant MAX_MINT_AMOUNT = 100 * 10**18; // 100 tokens with 18 decimals

    // Custom token name and symbol set by the deployer
    constructor(string memory tokenName, string memory tokenSymbol) ERC20(tokenName, tokenSymbol) {}

    /**
     * @notice Mint tokens to the caller
     * @dev Requires the caller to own an EarthPass NFT
     * @param amount Amount of tokens to mint (max 100)
     */
    function mint(uint256 amount) public {
        // Check if the caller has an EarthPass NFT
        require(hasEarthPass(msg.sender), "Must own an EarthPass NFT to mint tokens");

        // Add a safety check to prevent excessive minting
        require(amount <= MAX_MINT_AMOUNT, "Amount exceeds maximum mint limit");

        _mint(msg.sender, amount);
    }

    /**
     * @notice Transfer tokens to another EarthPass holder
     * @dev Both sender and recipient must own an EarthPass NFT
     * @param to Recipient address
     * @param amount Amount of tokens to transfer
     * @return success Whether the transfer was successful
     */
    function transferToEarthPassHolder(address to, uint256 amount) public returns (bool) {
        // Check if the recipient has an EarthPass NFT
        require(hasEarthPass(to), "Recipient must own an EarthPass NFT");

        // Transfer tokens
        _transfer(msg.sender, to, amount);
        return true;
    }

    /**
     * @notice Check if an address owns an EarthPass NFT
     * @param user Address to check
     * @return Whether the address owns an EarthPass NFT
     */
    function hasEarthPass(address user) public view returns (bool) {
        IERC721 earthPassNFT = IERC721(EARTHPASS_NFT_ADDRESS);
        return earthPassNFT.balanceOf(user) > 0;
    }
}
