const ipfs = require("../utilities/ipfs-client");
const logger = require("../utilities/logger");

const saveItem = async (req, res) => {
  try {
    logger.info(`Adding data to ipfs, ${JSON.stringify(req.body)}`);
    const _res = await ipfs.add(JSON.stringify(req.body));
    logger.info(`Data added to ipfs with cid: ${_res.path}`);
    res.status(200).json({ path: _res.path });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const getItem = async (req, res) => {
  try {
    const { cid } = req.params;
    logger.info(`Fetching data from ipfs with cid: ${cid}`);
    const data = await ipfs.get(cid);
    if (data === "") {
      logger.info(`No data found for cid: ${cid}`);
      res.status(404).json({ data: null });
    } else {
      res.status(200).json({ data: JSON.parse(data) });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

module.exports = {
  saveItem,
  getItem,
};
