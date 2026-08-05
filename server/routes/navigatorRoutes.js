const express = require("express");
const router = express.Router();

const {
  findCurrentClass,
} = require("../controllers/navigatorController");

router.post("/find-class", findCurrentClass);

module.exports = router;