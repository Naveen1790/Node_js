const express = require("express");

const router = express.Router();

const path = require("path");

router.get("^/$|/index(.html)?", (req, res) => {
  //1st way
  //res.sendFile('./views/index.html',{root:__dirname});
  //2nd way
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); //by default status is 302 so adding 301
});

module.exports = router;
