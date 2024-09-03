require('dotenv').config();
const express = require('express');
const UserRoutes = require("./routes/user.routes");
const MarketPlaceRoutes = require("./routes/marketplace.routes");
const logger = require('./utilities/logger');
const events = require('events');

// fix for libp2p MaxListenersExceededWarning error in helia
events.setMaxListeners(Infinity);

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

//routes
app.use('/asset', MarketPlaceRoutes);
app.use('/user', UserRoutes);

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  logger.info(`Marketplace API listening at <http://localhost>:${PORT}`);
});
