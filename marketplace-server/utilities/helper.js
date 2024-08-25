const provider = require("../utilities/provider");
const abis = require("../utilities/abi");

const parseAsset = (asset) => {
  const [tokenId, currentOwner, price, tokenURI] = asset;
  return {
    tokenId: tokenId.toNumber(),
    tokenURI,
    currentOwner,
    price: price.toNumber(),
  };
};

const getContractInstance = () => {
  // Create a new instance of the contract
  return new provider.eth.Contract(abis.nftMarketPlaceAbi, process.env.CONTRACT_ADDRESS);
}

const getLocalDeployer = async () => {
  // for now statically inject first account from local hardhat chain as platform user
  const [deployer] = await provider.eth.getAccounts();
  return deployer;
}

module.exports =  {
  parseAsset,
  getContractInstance,
  getLocalDeployer,
};
