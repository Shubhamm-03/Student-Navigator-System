const express = require("express");
const router = express.Router();

const { authMiddleware: auth } = require("../middleware/authMiddleware");

const {
  getNotifications,
} = require("../controllers/notificationController");

router.get("/", auth, getNotifications);

module.exports = router;
