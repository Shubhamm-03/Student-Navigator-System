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

// Update Logged-in Student Phone Number
const updatePhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const phoneStr = String(phone).trim();

    if (!/^\d{10}$/.test(phoneStr)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be a 10-digit number",
      });
    }

    const existing = await Student.findOne({
      phone: phoneStr,
      _id: { $ne: req.student.id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already linked to another student",
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.student.id,
      { phone: phoneStr },
      { new: true }
    ).populate("class");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Phone number updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Logged-in Student Class / Academic Information
const updateClass = async (req, res) => {
  try {
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Class is required",
      });
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.student.id,
      { class: classData._id },
      { new: true }
    ).populate("class");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Academic information updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Logged-in Student Profile Photo
const updatePhoto = async (req, res) => {
  try {
    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
      });
    }

    if (!/^data:image\/(png|jpe?g|webp|gif);base64,/.test(photo)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid image",
      });
    }

    const sizeInBytes = Buffer.from(photo.split(",")[1], "base64").length;

    if (sizeInBytes > 2 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Image must be smaller than 2 MB",
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.student.id,
      { profilePhoto: photo },
      { new: true }
    ).populate("class");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Profile photo updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Set Logged-in Student Email (one-time only)
const setupEmail = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.email && student.email.trim() !== "") {
      return res.status(403).json({
        success: false,
        message: "Email is already set and cannot be changed.",
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const emailStr = String(email).trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const existing = await Student.findOne({
      email: emailStr,
      _id: { $ne: student._id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This email is already linked to another student",
      });
    }

    student.email = emailStr;
    await student.save();

    const updated = await Student.findById(student._id).populate("class");

    res.json({
      success: true,
      message: "Email set successfully",
      student: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
  updatePhone,
  updateClass,
  updatePhoto,
  setupEmail,
};