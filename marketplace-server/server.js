require('dotenv').config();
const express = require('express');
const UserRoutes = require("./routes/user.routes");
const MarketPlaceRoutes = require("./routes/marketplace.routes");
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
app.use('/asset', MarketPlaceRoutes);
app.use('/user', UserRoutes);
app.use('/ipfs', IPFSRoutes);

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  logger.info(`Marketplace API listening at <http://localhost>:${PORT}`);
});
