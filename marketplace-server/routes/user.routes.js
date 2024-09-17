const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.post("/signup", UserController.signup);
router.post("/logout", UserController.logout);
router.get("/balance", UserController.getBalance);

module.exports = router;
