const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

const navigatorRoutes = require("./routes/navigatorRoutes");
const facultyRoutes = require("./routes/facultyRoutes");

const roomRoutes = require("./routes/roomRoutes");
const timetableRoutes = require("./routes/timetableRoutes");

const classRoutes = require("./routes/classRoutes");
const authRoutes = require("./routes/authRoutes");

const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const {
  generateDueNotifications,
} = require("./controllers/notificationController");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/students", studentRoutes);
app.use("/api/navigator", navigatorRoutes);

app.use("/api/faculty", facultyRoutes);
app.use("/api/rooms", roomRoutes);

app.use("/api/timetable", timetableRoutes);
app.use("/api/classes", classRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Student Navigator System Backend is Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Background tracker: generate class reminders every minute.
setInterval(() => {
  generateDueNotifications();
}, 60 * 1000);