const logger = require("../utilities/logger");
const helpers = require("../utilities/helper");
const {getContractInstance} = require("../utilities/helper");

const contract = getContractInstance();

const confirmCallerAddress = (req, res) => {
  if (!req.body.address) {
    return res.status(400).send({ error: 'Address is required' });
  }
}

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
      let allAssets = [];
      for (let i = 1; i <= Number(lastAssetId.toString()); i++) {
        const chainData = helpers.parseAsset(await contract.methods.getAssetById().call());
        const ipfsURI = await contract.methods.getAssetByURI().call();
        const ipfsRes = await axios.get(
          `${process.env.IPFS_GATEWAY}/${ipfsURI}`
        );
        const ipfsData = ipfsRes.data;
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
    const { account } = req.body;

    const allAssets = await listAllAssets();
    const ownedItems =
      allAssets.filter((el) => el.currentOwner === account.address) || [];

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
  createAsset,
  removeAsset,
  getAssetById,
  getOwnedItems,
  getListedAssets,
  listAllAssets,
  transferAssetOwnership,
}