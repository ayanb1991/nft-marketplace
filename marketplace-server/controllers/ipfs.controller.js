const ipfs = require("../utilities/ipfs-client");
const logger = require("../utilities/logger");

const ipfsProvider = new ipfs();

const saveItem = async (req, res) => {
  try {
    await ipfsProvider.createClient();
    const { data } = req.body;
    const _res = await ipfsProvider.add(
      JSON.stringify(data)
    );
    logger.info(`Data added to ipfs with cid: ${_res.path}`);
    res.status(200).json({ path: _res.path });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

module.exports = {
  saveItem
}
