const AuthController = require('./auth.controller');
const logger = require('../utilities/logger');
const {getContractInstance, getDeployer} = require("../utilities/helper");

const contract = getContractInstance();

const signup = async (req, res) => {
  try {
    const { address, email, password, displayName } = req.body;
    const _user = {
      email,
      password,
      displayName
    };
    logger.info(`signing up user with data ${JSON.stringify(_user)}`);
    const userRecord = await AuthController.signup(_user);
    // Feature: user will get joining bonus upon signing up
    const deployer = await getDeployer();
    await contract.methods.generateMTOKENS(address, 1000).send({from: deployer});

    return res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({ error: error.message });
  }
};

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

const buyMTokens = async (req, res) => {
  try {
    const { address } = req.body;

    // TODO: how an user can buy mtoken using ethers from metasmask?
    const mtokenTxn = await contract.methods.buyTokens().send({from: address, value: 1000000000000000000});

    res.status(200).json({ mtokenTxn });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
}

module.exports = {
  signup,
  logout,
  getBalance,
  buyMTokens
};
