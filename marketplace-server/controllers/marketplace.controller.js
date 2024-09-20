const logger = require("../utilities/logger");
const helpers = require("../utilities/helper");
const {getContractInstance} = require("../utilities/helper");
const web3 = require("web3");
const ipfs = require("../utilities/ipfs-client");
const contract = getContractInstance();

const getAssetById = async (req, res) => {
  try {
    const { assetId } = req.params;

    logger.info(`getting asset ${assetId}`);
    const asset = await contract.methods.getAsset(assetId).call();
    if (asset.tokenId) {
      res.status(200).json({ asset });
    } else {
      res.status(404).send("Asset not found");
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
}

const listAllAssets = () => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const lastAssetId =  await contract.methods.getLatestAssetId().call();
      const lastAssetIdBN = web3.utils.toNumber(lastAssetId);
      let allAssets = [];
      
      for (let assetId = 10001; assetId <= lastAssetIdBN; assetId++) {
        const chainData = helpers.parseAsset(await contract.methods.getAsset(assetId).call());
        const ipfsKey = chainData.tokenURI;
        let ipfsData = await ipfs.get(ipfsKey) || {};
        if (typeof ipfsData === "string") {
          ipfsData = JSON.parse(ipfsData);
        }
        console.log("ipfsData:", ipfsData, typeof ipfsData);
        // combine data obtained from chain and ipfs
        const _asset = {
          ...chainData,
          ...ipfsData,
        };
        allAssets.push(_asset);
      }
      
      resolve(allAssets);
    } catch (error) {
      reject(error);
    }
  });
  
  return promise;
};

const getOwnedItems = async (req, res, next) => {
  try {
    const { address } = req.params;

    const allAssets = await listAllAssets();
    const ownedItems = allAssets.filter((el) => web3.utils.toChecksumAddress(el.currentOwner) === web3.utils.toChecksumAddress(address)) || [];
    
    res.status(200).send(ownedItems);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

const getListedAssets = async (req, res, next) => {
  try {
    const allAssets = await listAllAssets();
    const assetForSale = allAssets.filter((el) => el.price !== 0);

    res.status(200).send(assetForSale);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

module.exports = {
  getAssetById,
  getOwnedItems,
  getListedAssets,
  listAllAssets,
}