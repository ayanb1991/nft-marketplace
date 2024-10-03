// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Marketplace is ERC1155, Ownable, Pausable {
    using Counters for Counters.Counter;

    // Token ID counters for MTOKEN and ATOKEN
    Counters.Counter private _atokenIdCounter;

    // price of 1 MTOKEN / ether
    uint256 private constant PRICE_PER_TOKEN = 0.1 ether;

    // Mapping from user addresses and their acccount balance in MTOKEN
    mapping(address => uint256) public balances;

    // token types
    uint256 private constant MTOKEN_ID = 1; // (FT)

    // if tokenURI is not an empty string => an NFT was created
    // if price is not 0 => an NFT was listed
    // if price is 0 && tokenURI is an empty string => NFT was transferred (either bought, or the listing was canceled)
    struct AssetListing {
        uint256 tokenId;
        address currentOwner;
        uint256 price;
        string tokenURI;
    }

    // Mapping from asset token ID to its details
    mapping(uint256 => AssetListing) private _listings;

    event AssetTransfer(uint256 tokenId, address from, address to, uint256 price);


    constructor() ERC1155("<https://api.example.com/metadata/{id}.json>") {
        // Start the asset token counter from 10000 + 1
         _atokenIdCounter._value = 10000;
    }

    // Mint function for MTOKEN
    function mintMTokens(address account, uint256 amount) public {
        _mint(account, MTOKEN_ID, amount, "");
    }

    // Function to buy extra MTOKENs in exchange for Ether
    function buyTokens() public payable {
        require(msg.value >= PRICE_PER_TOKEN, "Not enough Ether sent to buy at least one token");
        
        // Explicitly convert to uint256, truncating any fractional part
        uint256 tokensToBuy = uint256(msg.value / PRICE_PER_TOKEN);
        uint256 cost = tokensToBuy * PRICE_PER_TOKEN;

        _mint(msg.sender, MTOKEN_ID, tokensToBuy, "");

        // Refund excess Ether
        uint256 excess = msg.value - cost;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
    }

    function generateMTOKENS(address account, uint256 amount) public onlyOwner whenNotPaused {
        console.log("Generating MTOKEN for address: %s", account);
        _mint(account, MTOKEN_ID, amount, "");
    }


    function getAsset(uint256 assetId) public view returns (AssetListing memory) {
        return _listings[assetId];
    }

    function getLatestAssetId() public view returns (uint256) {
        return _atokenIdCounter.current();
    }

    // TODO: get MTOKEN balance of account (user)
    function getMTokenBalance(address account) public view returns (uint256) {
        return balanceOf(account, MTOKEN_ID);
    }


    // de-list an already created asset
    function clearListing(uint256 assetId) private {
        _listings[assetId].price = 0;
    }


    // Function to create a new asset (ATOKEN)
    function createAsset(uint256 priceInMTokens, string memory ipfsTokenURI) public whenNotPaused returns (uint256)  {
        _atokenIdCounter.increment();
        uint256 newAssetId = _atokenIdCounter.current();
        console.log("Asset ID: %s", newAssetId);

        // Set the details for the asset
        _listings[newAssetId] = AssetListing(
            newAssetId,
            payable(msg.sender),
            priceInMTokens,
            ipfsTokenURI
        );

        // Mint the asset token to the creator
        _mint(msg.sender, newAssetId, 1, "");

        return newAssetId;
    }

    function reListAsset(uint256 assetId, uint256 priceInMTokens, string memory ipfsTokenURI) public whenNotPaused {
        // in re listing, we are not minting fresh NFT, just updating the price and ipfsTokenURI
        console.log("Asset to update: %s", assetId);
        AssetListing memory listing = _listings[assetId];
        require(listing.price > 0, "Re listing not possible, Asset is already listed for sell");

        address seller = ownerOf(assetId);
        require(seller == msg.sender, "You are not the owner of this asset");

        listing.price = priceInMTokens;
        listing.tokenURI = ipfsTokenURI;
        _listings[assetId] = listing;
    }

    function removeAsset(uint256 assetId) public whenNotPaused {
        AssetListing memory listing = _listings[assetId];
        require(listing.price > 0, "Asset is not available or not listed for sell");

        address seller = ownerOf(assetId);
        console.log("removeAsset:Seller: %s Sender: %s", seller, msg.sender);
        require(seller == msg.sender, "You are not the owner of this asset");

        clearListing(assetId);
    }

    // Function to buy an asset
    function transferAssetOwnership(uint256 assetId) public whenNotPaused {
        AssetListing memory listing = _listings[assetId];
        require(balanceOf(msg.sender, MTOKEN_ID) >= listing.price, "Insufficient MTOKEN balance");

        address seller = ownerOf(assetId);
        require(seller != msg.sender, "Cannot buy your own asset");

        require(listing.price != 0, "Asset not listed for sell");

        // deduct MTOKENs from buyer and send to owner (FT)
        // TODO: need approval from spender or "ERC1155: caller is not token owner or approved" issue will occur
        _safeTransferFrom(msg.sender, seller, MTOKEN_ID, listing.price, "");

        // Transfer the asset token from owner to buyer (NFT)
        _safeTransferFrom(seller, msg.sender, assetId, 1, "");

        // Clear the price of the asset
        listing.price = 0;
        listing.currentOwner = payable(msg.sender);
        _listings[assetId] = listing;

        // TODO: remove listing of asset

        emit AssetTransfer(assetId, seller, msg.sender, listing.price);
    }

    // Function to get the owner of an asset token
    function ownerOf(uint256 assetId) public view returns (address) {
        AssetListing memory listing = _listings[assetId];
        require(listing.currentOwner != address(0), "Asset does not exist");
        return listing.currentOwner;
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