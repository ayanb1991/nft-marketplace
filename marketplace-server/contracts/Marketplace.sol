// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Marketplace is ERC1155Supply, Ownable, Pausable {
    using Counters for Counters.Counter;

    // Token ID counters for MTOKEN and ATOKEN
    Counters.Counter private _atokenIdCounter;

    // defined id of the next user to be registered
    uint256 public nextUserId;

    // Conversion rate: number of MTOKENs per 1 Ether
    uint256 public mtokenPerEther = 1000;

    // Mapping from user addresses and their acccount balance in MTOKEN
    mapping(address => uint256) public balances;

    // Mapping from user addresses and their ids
    mapping(address => uint256) public userIds;


    // Mapping from asset token ID to its price in MTOKEN
    mapping(uint256 => uint256) public assetPrices;


    constructor() ERC1155("<https://api.example.com/metadata/{id}.json>") {
        // Mint initial MTOKENs for the contract owner
        mintMTokens(msg.sender, 1000);
    }

    // Mint function for MTOKEN
    function mintMTokens(address account, uint256 amount) public onlyOwner {
        _mint(account, 1, amount, "");
    }

    // Function to register users and give them initial MTOKENs
    function registerUser(address user) public {
        require(balanceOf(user, 1) == 0, "User already registered");
        mintMTokens(user, 1000);
        userIds[user] = nextUserId;
        balances[user] = 1000;
        nextUserId++;
    }

    // Function to buy extra MTOKENs in exchange for Ether
    function buyMTokens() public payable {
        require(msg.value > 0, "Send Ether to buy MTOKENs");
        uint256 amount = msg.value * mtokenPerEther;
        mintMTokens(msg.sender, amount);
    }

    // Function to create a new asset (ATOKEN)
    function createAsset(uint256 priceInMTokens) public whenNotPaused {
        uint256 newAssetId = _atokenIdCounter.current();
        _atokenIdCounter.increment();

        // Mint the asset token to the creator
        _mint(msg.sender, newAssetId, 1, "");

        // Set the price for the asset
        assetPrices[newAssetId] = priceInMTokens;
    }

    // Function to buy an asset
    function buyAsset(uint256 assetId) public whenNotPaused {
        uint256 price = assetPrices[assetId];
        require(balanceOf(msg.sender, 1) >= price, "Insufficient MTOKEN balance");

        address owner = ownerOf(assetId);
        require(owner != msg.sender, "Cannot buy your own asset");

        // Transfer MTOKENs from buyer to owner
        safeTransferFrom(msg.sender, owner, 1, price, "");

        // Transfer the asset token from owner to buyer
        safeTransferFrom(owner, msg.sender, assetId, 1, "");

        // Clear the price of the asset
        assetPrices[assetId] = 0;
    }

    // Function to get the owner of an asset token
    function ownerOf(uint256 assetId) public view returns (address) {
        return balanceOf(address(this), assetId) > 0 ? address(this) : address(0);
    }

    // Function to pause the contract (onlyOwner)
    function pause() public onlyOwner {
        _pause();
    }

    // Function to unpause the contract (onlyOwner)
    function unpause() public onlyOwner {
        _unpause();
    }
}