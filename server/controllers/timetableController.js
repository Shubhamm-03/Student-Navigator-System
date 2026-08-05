const Timetable = require("../models/Timetable");
const Student = require("../models/Student");

// Register models used by populate()
require("../models/Subject");
require("../models/Faculty");
require("../models/Room");

// Add Timetable Entry
const addTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);

    res.status(201).json({
      success: true,
      message: "Timetable entry added successfully",
      timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Timetable Entries
const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.find()
      .populate("subject") 
      .populate("faculty")
      .populate("room");

    res.status(200).json({
      success: true,
      timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Today's Timetable
const getTodayTimetable = async (req, res) => {
  try {
    
    const student = await Student.findById(req.student.id);
    

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    const timetable = await Timetable.find({
      class: student.class,
      day: today,
    })
      .populate("subject")
      .populate("faculty")
      .populate("room")
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      day: today,
      totalClasses: timetable.length,
      timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Weekly Timetable
const getWeekTimetable = async (req, res) => {
  try {

    const student = await Student.findById(req.student.id);


    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const timetable = await Timetable.find({
      class: student.class,
    })
      .populate("subject")
      .populate("faculty")
      .populate("room")
      .sort({ day: 1, startTime: 1 });

    const week = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    timetable.forEach((item) => {
      if (week[item.day]) {
        week[item.day].push(item);
      }
    });

    res.status(200).json({
      success: true,
      week,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Current Class
const getCurrentClass = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get today's day
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Get current time (HH:MM)
    const currentTime = new Date().toTimeString().slice(0, 5);

    // Fetch today's timetable
    const timetable = await Timetable.find({
      class: student.class,
      day: today,
    })
      .populate("subject")
      .populate("faculty")
      .populate("room")
      .sort({ startTime: 1 });

    // Find the class that is currently running
    const currentClass = timetable.find(
      (item) =>
        currentTime >= item.startTime &&
        currentTime < item.endTime
    );

    if (!currentClass) {
      return res.status(200).json({
        success: true,
        message: "No class is running currently.",
      });
    }

    res.status(200).json({
      success: true,
      currentClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Next Class

const getNextClass = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);


    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    const currentTime = new Date().toTimeString().slice(0, 5);

    const timetable = await Timetable.find({
      class: student.class,
      day: today,
    })
      .populate("subject")
      .populate("faculty")
      .populate("room")
      .sort({ startTime: 1 });

    const nextClass = timetable.find(
      (item) => item.startTime > currentTime
    );

    if (!nextClass) {
      return res.status(200).json({
        success: true,
        message: "No more classes for today.",
      });
    }

    res.status(200).json({
      success: true,
      nextClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addTimetable,
  getTimetable,
  getTodayTimetable,
  getWeekTimetable,
  getCurrentClass,
  getNextClass,
};