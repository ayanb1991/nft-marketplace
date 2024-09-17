const provider = require("../utilities/provider");
const abis = require("../utilities/abi");
const web3 = require("web3");

const parseAsset = (asset) => {
  const {tokenId, currentOwner, price, tokenURI} = asset;
  return {
    tokenId: web3.utils.toNumber(tokenId),
    tokenURI,
    currentOwner,
    price: web3.utils.toNumber(price),
  };
};

const getContractInstance = () => {
  // Create a new instance of the contract
  return new provider.eth.Contract(abis.nftMarketPlaceAbi, process.env.CONTRACT_ADDRESS);
}

const getDeployer = async () => {
  // for now statically inject first account from local hardhat chain as deployer
  // TODO: fix this after initial review, for production, this should be the owner of the contract
  const [deployer] = await provider.eth.getAccounts();
  return deployer;
}

module.exports =  {
  parseAsset,
  getContractInstance,
  getDeployer,
};
