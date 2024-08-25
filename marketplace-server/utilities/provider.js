const { Web3, HttpProvider } = require('web3');

const localProvider = new Web3(new HttpProvider(process.env.DEPLOYED_NODE_URL));

module.exports = localProvider;
