const express = require("express");
const router = express.Router();
const MarketPlaceController = require("../controllers/marketplace.controller");

router.get("/:assetId", MarketPlaceController.getAssetById);
router.get("/listed", MarketPlaceController.getListedAssets);
router.get("/owned", MarketPlaceController.getOwnedItems);

module.exports = router;