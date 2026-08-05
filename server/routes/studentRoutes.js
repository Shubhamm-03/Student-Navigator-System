const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  addStudent,
  getStudents,
  findStudent,
  getProfile,
} = require("../controllers/studentController");

router.post("/add", addStudent);
router.get("/", getStudents);

router.post("/find", findStudent);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
