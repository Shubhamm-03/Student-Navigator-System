const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Class = require("../models/Class");

const login = async (req, res) => {
  try {
    const { phone } = req.body;

if (!phone) {
  return res.status(400).json({
    message: "Phone number is required",
  });
}

const student = await Student.findOne({ phone }).populate("class");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      student,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  login,
};