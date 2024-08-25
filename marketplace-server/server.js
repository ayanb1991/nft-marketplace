require('dotenv').config();
const express = require('express');
const UserRoutes = require("./routes/user.routes");
const MarketPlaceRoutes = require("./routes/marketPlace.routes");
const logger = require('./utilities/logger');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

//routes
app.use(MarketPlaceRoutes);
app.use(UserRoutes);

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  logger.info(`Marketplace API listening at <http://localhost>:${PORT}`);
});
