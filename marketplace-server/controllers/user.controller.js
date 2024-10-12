const AuthController = require('./auth.controller');
const logger = require('../utilities/logger');
const { getContractInstance } = require("../utilities/helper");

const contract = getContractInstance();

const logout = async (req, res) => {
  try {
    const { uid } = req.body;
    await AuthController.revokeRefreshTokens(uid);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

const getBalance = async (req, res) => {
  try {
    const { address } = req.body;
    logger.info(`fetching balance for ${address}`);
    const balance = await contract.methods.getMTokenBalance(address).call();
    logger.info(`user MTOKEN balance: ${balance}`);
    res.json({ message: parseInt(balance) });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  logout,
  getBalance,
};
