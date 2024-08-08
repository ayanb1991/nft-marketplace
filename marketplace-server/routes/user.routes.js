const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const UserMiddelWare = require("../middlewares/user.middleware");

router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.post(
  "/create/wallet",
  UserMiddelWare.loggedIn,
  UserController.createWallet
);

module.exports = router;
