const express = require("express");
const router = express.Router();
const IPFSController = require("../controllers/ipfs.controller");

router.post("/", IPFSController.saveItem);

module.exports = router;