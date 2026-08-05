const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  addTimetable,
  getTimetable,
  getTodayTimetable,
  getWeekTimetable,
  getCurrentClass,
  getNextClass,
} = require("../controllers/timetableController");

router.post("/add", addTimetable);
router.get("/", getTimetable);

router.get("/today", authMiddleware, getTodayTimetable);
router.get("/week", authMiddleware, getWeekTimetable);
router.get("/current", authMiddleware, getCurrentClass);
router.get("/next", authMiddleware, getNextClass);

module.exports = router;
