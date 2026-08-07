const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    type: {
      type: String,
      default: "general",
    },

    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    title: String,

    message: String,

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);