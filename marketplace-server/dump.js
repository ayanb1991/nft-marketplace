const Web3 = require('web3');
const { abi } = require('./interfaces/Marketplace.json');

// Set up Web3 provider
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.DEPLOYED_NODE_URL));

// Create a new instance of the contract
const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

// Endpoint to register a user
app.post('/register', async (req, res) => {
  const { address } = req.body;

  try {
    const transaction = contract.methods.registerUser();
    const gas = await transaction.estimateGas({ from: address });
    const data = transaction.encodeABI();

    const signedTransaction = await web3.eth.accounts.signTransaction(
      {
        to: process.env.CONTRACT_ADDRESS,
        data,
        gas,
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    logger.info(`User registered: ${address}`, { receipt });
    res.status(200).send(receipt);
  } catch (error) {
    logger.error('Error registering user', { error });
    res.status(500).send('Error registering user');
  }
});

// Endpoint to buy MTOKENs
app.post('/buyMTokens', async (req, res) => {
  const { address, etherAmount } = req.body;

  try {
    const transaction = contract.methods.buyMTokens();
    const gas = await transaction.estimateGas({ from: address, value: web3.utils.toWei(etherAmount, 'ether') });
    const data = transaction.encodeABI();

    const signedTransaction = await web3.eth.accounts.signTransaction(
      {
        to: process.env.CONTRACT_ADDRESS,
        data,
        gas,
        value: web3.utils.toWei(etherAmount, 'ether'),
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    logger.info(`MTokens bought: ${address}`, { receipt });
    res.status(200).send(receipt);
  } catch (error) {
    logger.error('Error buying MTokens', { error });
    res.status(500).send('Error buying MTokens');
  }
});

// Endpoint to create an asset
app.post('/createAsset', async (req, res) => {
  const { address, priceInMTokens } = req.body;

  try {
    const transaction = contract.methods.createAsset(priceInMTokens);
    const gas = await transaction.estimateGas({ from: address });
    const data = transaction.encodeABI();

    const signedTransaction = await web3.eth.accounts.signTransaction(
      {
        to: process.env.CONTRACT_ADDRESS,
        data,
        gas,
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    logger.info(`Asset created by: ${address} with price: ${priceInMTokens}`, { receipt });
    res.status(200).send(receipt);
  } catch (error) {
    logger.error('Error creating asset', { error });
    res.status(500).send('Error creating asset');
  }
});

// Endpoint to buy an asset
app.post('/buyAsset', async (req, res) => {
  const { address, assetId } = req.body;

  try {
    const transaction = contract.methods.buyAsset(assetId);
    const gas = await transaction.estimateGas({ from: address });
    const data = transaction.encodeABI();

    const signedTransaction = await web3.eth.accounts.signTransaction(
      {
        to: process.env.CONTRACT_ADDRESS,
        data,
        gas,
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    logger.info(`Asset bought by: ${address}, assetId: ${assetId}`, { receipt });
    res.status(200).send(receipt);
  } catch (error) {
    logger.error('Error buying asset', { error });
    res.status(500).send('Error buying asset');
  }
});