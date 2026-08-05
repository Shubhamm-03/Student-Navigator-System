const express = require("express");
const router = express.Router();

const {
  addRoom,
  getRooms,
  findRoom,
} = require("../controllers/roomController");

router.post("/add", addRoom);

router.get("/", getRooms);

router.get("/search/:roomNo", findRoom);

module.exports = router;