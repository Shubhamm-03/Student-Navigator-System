const Student = require("../models/Student");
const Class = require("../models/Class");

// Add Student
const addStudent = async (req, res) => {
  try {
    const {
      name,
      phone,
      rollNo,
      department,
      semester,
      section,
      academicYear,
    } = req.body;

    const classData = await Class.findOne({
      department,
      semester,
      section,
      academicYear,
    });

    if (!classData) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    const student = await Student.create({
      name,
      phone,
      rollNo,
      class: classData._id,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("class");

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Find Student by Name and Phone
const findStudent = async (req, res) => {
  try {
    const { rollNo, phone } = req.body;

    const student = await Student.findOne({
      rollNo,
      phone,
    }).populate("class");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Logged-in Student Profile
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).populate("class");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addStudent,
  getStudents,
  findStudent,
  getProfile,
};