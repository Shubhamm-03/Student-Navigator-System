const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate classes
classSchema.index(
  {
    department: 1,
    semester: 1,
    section: 1,
    academicYear: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Class", classSchema);