const Room = require("../models/Room");

// =========================
// Add Room
// =========================
const addRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: "Room added successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Rooms
// =========================
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNo: 1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Find Room by Room Number
// =========================
const findRoom = async (req, res) => {
  try {
    const { roomNo } = req.params;

    const room = await Room.findOne({
      roomNo: roomNo.toUpperCase(),
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Export Controllers
// =========================
module.exports = {
  addRoom,
  getRooms,
  findRoom,
};