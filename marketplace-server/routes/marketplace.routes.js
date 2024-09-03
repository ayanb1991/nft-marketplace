const express = require("express");
const router = express.Router();
const MarketPlaceController = require("../controllers/marketplace.controller");

router.post("/", MarketPlaceController.createAsset);
router.get("/:assetId", MarketPlaceController.getAssetById);
router.get("/listed", MarketPlaceController.getListedAssets);
router.get("/owned", MarketPlaceController.getOwnedItems);
router.delete("/:assetId", MarketPlaceController.removeAsset);
router.post("/transfer/:assetId", MarketPlaceController.transferAssetOwnership);

module.exports = router;