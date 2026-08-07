const express = require("express");
const router = express.Router();

const { authMiddleware: auth } = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead,
  markAllRead,
} = require("../controllers/notificationController");

router.get("/", auth, getNotifications);
router.put("/read-all", auth, markAllRead);
router.put("/:id/read", auth, markAsRead);

module.exports = router;
