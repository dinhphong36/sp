const express = require("express");
const router = express.Router();

const newController = require("../app/controllers/newController");

router.get("/", newController.index);

module.exports = router;