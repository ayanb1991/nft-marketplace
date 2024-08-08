const express = require("express");
const router = express.Router();
const MarketPlaceController = require("../controllers/marketplace.controller");

router.post("/nft/create", MarketPlaceController.createNFT);
router.get("/nft/:tokenId", MarketPlaceController.getNFTById);

module.exports = router;