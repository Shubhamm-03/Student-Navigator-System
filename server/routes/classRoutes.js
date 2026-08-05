const express = require("express");
const router = express.Router();

const {
  addClass,
  getClasses,
  getClassById,
  deleteClass,
} = require("../controllers/classController");

router.post("/add", addClass);

router.get("/", getClasses);

router.get("/:id", getClassById);

router.delete("/:id", deleteClass);

module.exports = router;