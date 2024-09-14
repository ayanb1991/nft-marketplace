const ipfs = require("../utilities/ipfs-client");
const logger = require("../utilities/logger");



class IPFSController {
  ipfsProvider = null;

  constructor() {
    this.ipfsProvider = new ipfs();
    this.ipfsProvider.createClient();
  }

  async saveItem(req, res) {
    try {
      const { data } = req.body;
      const _res = await this.ipfsProvider.add(
        JSON.stringify(data)
      );
      logger.info(`Data added to ipfs with cid: ${_res.path}`);
      res.status(200).json({ path: _res.path });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
}

export default IPFSController;