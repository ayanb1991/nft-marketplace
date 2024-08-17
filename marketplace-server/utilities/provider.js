require("dotenv").config();
const { ethers } = require("ethers");

const localProvider = new ethers.providers.JsonRpcProvider(
  process.env.LOCAL_PROVIDER
);

module.exports = localProvider;
