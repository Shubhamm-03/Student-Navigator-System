const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  addStudent,
  getStudents,
  findStudent,
  getProfile,
  updatePhone,
  updateClass,
  updatePhoto,
  setupEmail,
} = require("../controllers/studentController");

router.post("/add", addStudent);
router.get("/", getStudents);

router.post("/find", findStudent);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile/phone", authMiddleware, updatePhone);
router.put("/profile/class", authMiddleware, updateClass);
router.put("/profile/photo", authMiddleware, updatePhoto);
router.put("/profile/email", authMiddleware, setupEmail);

module.exports = router;
