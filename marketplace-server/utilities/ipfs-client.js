class IPFSClient {
    static client;

    constructor() {
        this.client = null;
        this.fs = null;
    }

    static getClient() {
        return this.client;
    }

    async createClient() {
        const { createHelia } = await import('helia');
        const { unixfs } = await import('@helia/unixfs');

        // create a Helia node
        this.client = await createHelia();
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
            const cid = await this.fs.addBytes(encoder.encode(JSON.stringify(jsonObject)), this.client.blockstore);

            return cid;
        } catch (error) {
            throw new Error(error);
        }
    }

    async get(cid) {
        if (!this.client) throw new Error("Client not found");

        // this decoder will turn Uint8Arrays into strings
        const decoder = new TextDecoder();
        let text = '';

        for await (const chunk of this.fs.cat(cid)) {
            text += decoder.decode(chunk, {
                stream: true
            })
        }

        return text;
    }
}

module.exports = IPFSClient;
