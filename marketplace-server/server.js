require('dotenv').config();
const express = require('express');
const UserRoutes = require("./routes/user.routes");
const MarketPlaceRoutes = require("./routes/marketplace.routes");
const logger = require('./utilities/logger');
const cors = require('cors');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

//routes
app.use('/asset', MarketPlaceRoutes);
app.use('/user', UserRoutes);

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  logger.info(`Marketplace API listening at <http://localhost>:${PORT}`);
});
