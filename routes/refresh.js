const express = require("express");
const router = express.Router();
const refreshtokenController = require("../controllers/refreshtokenController");

router.get("/", refreshtokenController.handlerefreshToken);

module.exports = router;
