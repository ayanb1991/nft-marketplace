const logger = require("./logger");

class IPFSClient {
  static instance;

  constructor() {
    if (IPFSClient.instance) {
      return IPFSClient.instance;
    }

    this.client = null;
    this.fs = null;

    IPFSClient.instance = this;
  }

  static getInstance() {
    if (!IPFSClient.instance) {
      IPFSClient.instance = new IPFSClient();
    }
    return IPFSClient.instance;
  }

  async createClient() {
    const { createHelia } = await import("helia");
    const { unixfs } = await import("@helia/unixfs");

    // create a Helia node
    this.client = await createHelia();
    // set max concurrent connections to 10
    this.client.libp2p.con;
    // create a filesystem on top of Helia, in this case it's UnixFS
    this.fs = unixfs(this.client);
    // print out our node's PeerId
    console.log(this.client.libp2p.peerId);
  }

  async add(jsonObject) {
    if (!this.client) throw new Error("Client not found");

    try {
      // we will use this TextEncoder to turn strings into Uint8Arrays
      const encoder = new TextEncoder();
      // add the bytes to your node and receive a unique content identifier
      const cid = await this.fs.addBytes(
        encoder.encode(JSON.stringify(jsonObject)),
        this.client.blockstore
      );

      return {
        path: cid.toString(),
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async get(cid) {
    let text = "";
    try {
      if (!this.client) throw new Error("Client not found");

      // this decoder will turn Uint8Arrays into strings
      const decoder = new TextDecoder();

      const cancelReading = new AbortController();
      // Issue: unixfs waits infinitely for non existent files
      // cancel reading file after 2 seconds
      // setTimeout(() => {
      //   cancelReading.abort();
      // }, 2000);

      await this.fs.stat(cid, {offline: true});

      for await (const chunk of this.fs.cat(cid, {
        signal: cancelReading.signal,
      })) {
        text += decoder.decode(chunk, {
          stream: true,
        });
      }

      logger.info(`Data retrieved from ipfs, data: ${text}`);
      const res = JSON.parse(text);
      return res;
    } catch (error) {
      logger.error(error.message);
      return "";
    }
  }
}

module.exports = IPFSClient.getInstance();
