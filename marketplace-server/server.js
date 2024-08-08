require('dotenv').config();
const express = require('express');
const UserRoutes = require("./routes/user.routes");
const MarketPlaceRoutes = require("./routes/marketPlace.routes");

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

//routes
app.use(MarketPlaceRoutes);
app.use(UserRoutes);

// Start the server
app.listen(port, () => {
  logger.info(`Marketplace API listening at <http://localhost>:${process.env.PORT}`);
});
