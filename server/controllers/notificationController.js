const Notification = require("../models/Notification");
const Student = require("../models/Student");
const Timetable = require("../models/Timetable");

require("../models/Subject");
require("../models/Faculty");
require("../models/Room");

const { getKolkataClock, timeToMinutes } = require("../utils/timeUtils");

const REMINDER_MINUTES = 15;

// Create a "next class is starting soon" reminder for one student.
// Deduped per class per day so the same reminder is only created once.
const generateNextClassNotification = async (student) => {
  if (!student || !student.class) return null;

  const { day, time } = getKolkataClock();
  const nowMinutes = timeToMinutes(time);

  const timetable = await Timetable.find({
    class: student.class,
    day,
  })
    .sort({ startTime: 1 })
    .populate("subject")
    .populate("room");

  const nextClass = timetable.find(
    (item) => timeToMinutes(item.startTime) > nowMinutes
  );

  if (!nextClass) return null;

  const untilMinutes =
    timeToMinutes(nextClass.startTime) - nowMinutes;

  if (untilMinutes > REMINDER_MINUTES || untilMinutes <= 0) return null;

  const existing = await Notification.findOne({
    student: student._id,
    type: "class-upcoming",
    "meta.class": nextClass._id,
    "meta.day": day,
  });

  if (existing) return null;

  const subjectName =
    nextClass.subject?.name || "Class";
  const roomNo = nextClass.room?.roomNo || "a room";

  const notification = await Notification.create({
    student: student._id,
    type: "class-upcoming",
    meta: { class: nextClass._id, day },
    title: `Class in ${untilMinutes} min`,
    message: `${subjectName} starts at ${nextClass.startTime} in ${roomNo}.`,
  });

  return notification;
};

// Generate reminders for every student (used by the background tracker).
const generateDueNotifications = async () => {
  try {
    const students = await Student.find({
      class: { $ne: null },
    }).select("_id class");

    for (const student of students) {
      try {
        await generateNextClassNotification(student);
      } catch (error) {
        // Continue with the next student; never let one failure stop the run.
      }
    }
  } catch (error) {
    console.error("Notification generation failed:", error.message);
  }
};

const getNotifications = async (req, res) => {
  try {
    // Generate any due reminders before returning the list.
    try {
      const student = await Student.findById(req.student.id);
      if (student) await generateNextClassNotification(student);
    } catch (error) {
      console.error("Notification generation failed:", error.message);
    }

    const notifications = await Notification.find({
      student: req.student.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      notifications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, student: req.student.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { student: req.student.id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllRead,
  generateDueNotifications,
};
