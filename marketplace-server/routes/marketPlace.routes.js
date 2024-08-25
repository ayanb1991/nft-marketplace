const express = require("express");
const router = express.Router();
const MarketPlaceController = require("../controllers/marketplace.controller");

router.post("/asset", MarketPlaceController.createAsset);
router.get("/asset/:assetId", MarketPlaceController.getAssetById);
router.get("/asset/listed", MarketPlaceController.getListedAssets);
router.get("/asset/owned", MarketPlaceController.getOwnedItems);
router.delete("/asset/:assetId", MarketPlaceController.removeAsset);
router.post("/asset/transfer/:assetId", MarketPlaceController.transferAssetOwnership);
router.post("/mtoken/buy", MarketPlaceController.buyMTokens);

module.exports = router;