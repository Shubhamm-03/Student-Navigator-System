const Timetable = require("../models/Timetable");
const {
  upsertCollege,
  upsertDepartment,
  upsertClass,
  upsertSubject,
  upsertFaculty,
  upsertRoom,
  classLabel,
} = require("../utils/upsertHelpers");
const { parseTimetableText } = require("../utils/timetableParser");

const importTimetable = async (req, res) => {
  try {
    const text = req.body?.text;

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        success: false,
        message: "No timetable text provided.",
      });
    }

    const parsed = parseTimetableText(text);

    if (!parsed.entries.length) {
      return res.status(400).json({
        success: false,
        message: "No class entries could be parsed from the timetable text. Please check the file format.",
      });
    }

    const { metadata } = parsed;

    // 1. College / Department / Class
    const college = await upsertCollege(metadata.collegeName);
    const department = await upsertDepartment(college, metadata.departmentCode, metadata.departmentName);
    const classDoc = await upsertClass(college, department, metadata);

    // 2. Subjects
    const subjectCodes = [...new Set(parsed.entries.map((entry) => entry.subjectCode))];
    const subjects = {};

    for (const code of subjectCodes) {
      const entry = parsed.entries.find((item) => item.subjectCode === code);
      subjects[code] = await upsertSubject({
        code,
        name: entry.subjectName,
        credits: 0,
      });
    }

    // 3. Faculty
    const facultyRecords = {};

    for (const name of parsed.facultyNames) {
      const entry = parsed.entries.find((item) => item.facultyName === name);
      const subjectId = entry ? subjects[entry.subjectCode]?._id : null;
      facultyRecords[name] = await upsertFaculty(college, department, name, subjectId);
    }

    // 4. Rooms
    const roomRecords = {};

    for (const roomNo of parsed.rooms) {
      roomRecords[roomNo] = await upsertRoom(college, department, roomNo);
    }

    // 5. Replace existing timetable entries for this class.
    const previousCount = await Timetable.countDocuments({ class: classDoc._id });
    await Timetable.deleteMany({ class: classDoc._id });

    const created = [];

    for (const entry of parsed.entries) {
      created.push(
        await Timetable.create({
          class: classDoc._id,
          day: entry.day,
          startTime: entry.startTime,
          endTime: entry.endTime,
          subject: entry.subjectCode ? subjects[entry.subjectCode]?._id || null : null,
          faculty: entry.facultyName ? facultyRecords[entry.facultyName]?._id || null : null,
          room: entry.roomNo ? roomRecords[entry.roomNo]?._id || null : null,
          college: college._id,
          department: department._id,
        })
      );
    }

    res.status(201).json({
      success: true,
      message: `Timetable imported successfully for ${classLabel(classDoc)}.`,
      summary: {
        college: college.name,
        department: department.code,
        class: classLabel(classDoc),
        semester: classDoc.semester,
        section: classDoc.section,
        academicYear: classDoc.academicYear,
        subjectsCreated: subjectCodes.length,
        faculty: facultyRecords,
        rooms: parsed.rooms,
        entriesImported: created.length,
        entriesReplaced: previousCount,
        totalClasses: parsed.entries.length,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  importTimetable,
  inferRoomDetails: null,
  classLabel,
};
