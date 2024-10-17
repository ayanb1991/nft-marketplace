require('dotenv').config();
const express = require('express');
const IPFSRoutes = require("./routes/ipfs.routes");
const logger = require('./utilities/logger');
const events = require('events');
const cors = require('cors');
const ipfs = require("./utilities/ipfs-client");

ipfs.createClient();

// fix for libp2p MaxListenersExceededWarning error in helia
events.setMaxListeners(Infinity);

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

//routes
app.use('/ipfs', IPFSRoutes);

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  logger.info(`IPFS Server listening at <http://localhost>:${PORT}`);
});
