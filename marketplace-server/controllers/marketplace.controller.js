const logger = require("../utilities/logger");
const helpers = require("../utilities/helper");
const { getContractInstance } = require("../utilities/helper");
const web3 = require("web3");
const contract = getContractInstance();

const _getAssetById = async (assetId) => {
  try {
    const chainData = helpers.parseAsset(
      await contract.methods.getAsset(assetId).call()
    );

    logger.info(`chainData for assetId ${assetId}: ${JSON.stringify(chainData)}`);

    const ipfsKey = chainData.tokenURI;

    let ipfsData = (await helpers.getIPFSData(ipfsKey)) || {};
    if (typeof ipfsData === "string") {
      ipfsData = JSON.parse(ipfsData);
    }

    logger.info(`ipfsData for assetId ${assetId}: ${JSON.stringify(ipfsData)}`);
    
    // combine data obtained from chain and ipfs
    const {price, ...chainDataRest} = chainData;
    const _asset = {
      ...chainDataRest,
      ...ipfsData,
      price // prefer price from chain
    };
    return _asset;
  } catch (error) {
    logger.error(error.message);
    return null;
  }
}

const getAssetById = async (req, res) => {
  try {
    const { assetId } = req.params;

    const _asset = await _getAssetById(assetId);
    if (_asset) {
      res.status(200).json({ asset: _asset });
    } else {
      res.status(404).send("Asset not found");
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

const listAllAssets = () => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const lastAssetId = await contract.methods.getLatestAssetId().call();
      const lastAssetIdBN = web3.utils.toNumber(lastAssetId);
      let allAssets = [];

      for (let assetId = 10001; assetId <= lastAssetIdBN; assetId++) {
        const _asset = await _getAssetById(assetId);
        if (_asset) {
          allAssets.push(_asset);
        }
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
    const ownedItems =
      allAssets.filter(
        (el) =>
          web3.utils.toChecksumAddress(el.currentOwner) ===
          web3.utils.toChecksumAddress(address) && el.price === 0
      ) || [];

    res.status(200).send(ownedItems);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

const getListedAssets = async (req, res, next) => {
  try {
    const allAssets = await listAllAssets();
    const assetForSale = allAssets.filter((el) => el.price > 0);
    logger.silly(assetForSale);

    res.status(200).send(assetForSale);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

const getAssetOwnershipHistory = async (req, res, next) => {
  try {
    const { assetId } = req.params;

    // Get past events
    let events = await contract.getPastEvents("AssetTransfer", {
      filter: { tokenId: assetId },
      fromBlock: 0,
      toBlock: "latest",
    });

    const ownershipHistory = events.map((event) => {
      return {
        fromOwner: event.returnValues.from,
        toOwner: event.returnValues.to,
        blockNumber: web3.utils.toNumber(event.blockNumber),
        transactionHash: event.transactionHash,
      };
    });

    // Sort events by block number to ensure chronological order
    ownershipHistory.sort((a, b) => a.blockNumber - b.blockNumber);

    res.status(200).send({
      currentOwner: ownershipHistory[ownershipHistory.length - 1].toOwner,
      history: ownershipHistory,
    });

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
  getAssetOwnershipHistory
};
