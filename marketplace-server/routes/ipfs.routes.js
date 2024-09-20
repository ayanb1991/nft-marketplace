const express = require("express");
const router = express.Router();
const IPFSController = require("../controllers/ipfs.controller");

router.post("/", IPFSController.saveItem);
router.get("/:cid", IPFSController.getItem);

module.exports = router;