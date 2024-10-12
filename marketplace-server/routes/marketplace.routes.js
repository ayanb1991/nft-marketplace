const express = require("express");
const router = express.Router();
const MarketPlaceController = require("../controllers/marketplace.controller");

router.get("/listed", MarketPlaceController.getListedAssets);
router.get("/owned/:address", MarketPlaceController.getOwnedItems);
router.get("/history/:assetId", MarketPlaceController.getAssetOwnershipHistory);
router.get("/:assetId", MarketPlaceController.getAssetById);

module.exports = router;