const express = require("express");
const router = express.Router();

const UserController = require("../app/controllers/UserController");

router.get("/login", UserController.login);
router.get("/register", UserController.register);
router.post("/created", UserController.created);
router.post("/logined", UserController.logined);

module.exports = router;