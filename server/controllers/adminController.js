const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Class = require("../models/Class");
const Room = require("../models/Room");
const Timetable = require("../models/Timetable");
const Subject = require("../models/Subject");
const Department = require("../models/Department");
const College = require("../models/College");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resources = {
  students: {
    model: Student,
    populate: ["class", "college", "department"],
    blockedBy: [],
  },
  faculty: {
    model: Faculty,
    populate: ["subject", "department", "college"],
    blockedBy: [{ model: Timetable, field: "faculty", label: "timetable entries" }],
  },
  classes: {
    model: Class,
    populate: ["college"],
    blockedBy: [
      { model: Student, field: "class", label: "students" },
      { model: Timetable, field: "class", label: "timetable entries" },
    ],
  },
  rooms: {
    model: Room,
    populate: ["college", "department"],
    blockedBy: [{ model: Timetable, field: "room", label: "timetable entries" }],
  },
  timetable: {
    model: Timetable,
    populate: ["class", "subject", "faculty", "room", "college", "department"],
    blockedBy: [],
  },
  subjects: {
    model: Subject,
    populate: [],
    blockedBy: [
      { model: Faculty, field: "subject", label: "faculty records" },
      { model: Timetable, field: "subject", label: "timetable entries" },
    ],
  },
  departments: {
    model: Department,
    populate: ["college"],
    blockedBy: [{ model: Faculty, field: "department", label: "faculty records" }],
  },
  colleges: {
    model: College,
    populate: [],
    blockedBy: [],
  },
};

const formatError = (error) => {
  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    return `${field} already exists.`;
  }

  return error.message || "Unable to complete the request.";
};

const applyPopulate = (query, fields) => {
  fields.forEach((field) => query.populate(field));
  return query;
};

const getResourceConfig = (type, res) => {
  const config = resources[type];

  if (!config) {
    res.status(404).json({ success: false, message: "Unknown resource." });
    return null;
  }

  return config;
};

const getDashboard = async (req, res) => {
  try {
    const [students, faculty, classes, rooms, timetable, recentStudents, upcomingSchedule] =
      await Promise.all([
        Student.countDocuments(),
        Faculty.countDocuments(),
        Class.countDocuments(),
        Room.countDocuments(),
        Timetable.countDocuments(),
        Student.find().populate("class").sort({ createdAt: -1 }).limit(5),
        Timetable.find()
          .populate("class")
          .populate("subject")
          .populate("faculty")
          .populate("room")
          .sort({ day: 1, startTime: 1 })
          .limit(6),
      ]);

    res.json({
      success: true,
      stats: { students, faculty, classes, rooms, timetable },
      recentStudents,
      upcomingSchedule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: formatError(error) });
  }
};

const getCatalog = async (req, res) => {
  try {
    const [classes, subjects, departments, faculty, rooms, colleges] = await Promise.all([
      Class.find().sort({ department: 1, semester: 1, section: 1 }),
      Subject.find().sort({ code: 1 }),
      Department.find().sort({ code: 1 }),
      Faculty.find().populate("subject").sort({ facultyName: 1 }),
      Room.find().sort({ roomNo: 1 }),
      College.find().sort({ name: 1 }),
    ]);

    res.json({ success: true, catalog: { classes, subjects, departments, faculty, rooms, colleges } });
  } catch (error) {
    res.status(500).json({ success: false, message: formatError(error) });
  }
};

const getResources = async (req, res) => {
  const config = getResourceConfig(req.params.type, res);
  if (!config) return;

  try {
    const sort = req.params.type === "students" ? { createdAt: -1 } : { createdAt: -1 };
    const data = await applyPopulate(config.model.find().sort(sort), config.populate);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: formatError(error) });
  }
};

const createResource = async (req, res) => {
  const config = getResourceConfig(req.params.type, res);
  if (!config) return;

  try {
    const item = await config.model.create(req.body);
    const data = await applyPopulate(config.model.findById(item._id), config.populate);
    res.status(201).json({ success: true, message: "Record created successfully.", data });
  } catch (error) {
    res.status(400).json({ success: false, message: formatError(error) });
  }
};

const updateResource = async (req, res) => {
  const config = getResourceConfig(req.params.type, res);
  if (!config) return;

  try {
    const item = await config.model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Record not found." });
    }

    const data = await applyPopulate(config.model.findById(item._id), config.populate);
    res.json({ success: true, message: "Record updated successfully.", data });
  } catch (error) {
    res.status(400).json({ success: false, message: formatError(error) });
  }
};

const deleteResource = async (req, res) => {
  const config = getResourceConfig(req.params.type, res);
  if (!config) return;

  try {
    const item = await config.model.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Record not found." });
    }

    for (const reference of config.blockedBy) {
      const count = await reference.model.countDocuments({ [reference.field]: item._id });
      if (count) {
        return res.status(409).json({
          success: false,
          message: `This record is in use by ${count} ${reference.label} and cannot be deleted.`,
        });
      }
    }

    await item.deleteOne();
    res.json({ success: true, message: "Record deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: formatError(error) });
  }
};

module.exports = {
  loginAdmin,
  getDashboard,
  getCatalog,
  getResources,
  createResource,
  updateResource,
  deleteResource,
};
