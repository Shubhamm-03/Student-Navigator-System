const Student = require("../models/Student");
const Timetable = require("../models/Timetable");

const findCurrentClass = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Find student
    const student = await Student.findOne({ name, phone });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get current day
    const days = [
     "Sunday",
     "Monday",
     "Tuesday",
     "Wednesday",
     "Thursday",
     "Friday",
     "Saturday",
    ];

const today = days[new Date().getDay()];

    const timetable = await Timetable.find({
      day: today,
      section: student.section,
    })
      .populate("faculty")
      .populate("room");

    res.status(200).json({
      success: true,
      student,
      timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  findCurrentClass,
};