const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.post("/signup", UserController.signup);
router.post("/logout", UserController.logout);
router.get("/balance", UserController.getBalance);
router.post("/recharge", UserController.buyMTokens);

module.exports = router;
