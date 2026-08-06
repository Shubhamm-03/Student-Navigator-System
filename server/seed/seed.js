const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");

// Models
const Department = require("../models/Department");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Faculty = require("../models/Faculty");
const Room = require("../models/Room");
const Student = require("../models/Student");
const Timetable = require("../models/Timetable");

// Seed Data
const departmentData = require("./departmentData");
const classData = require("./classData");
const subjectData = require("./subjectData");
const facultyData = require("./facultyData");
const roomData = require("./roomData");
const studentData = require("./studentData");

// Timetable Seed Data
const timetableData = require("./timetable/cse-ai-sem3-2b");

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🗑 Clearing old data...");

await Timetable.deleteMany({});
await Student.deleteMany({});
await Class.deleteMany({});
await Faculty.deleteMany({});
await Subject.deleteMany({});
await Room.deleteMany({});
await Department.deleteMany({});


    console.log("🏢 Inserting Departments...");

const departments = await Department.insertMany(departmentData);

const departmentMap = {};

departments.forEach((dept) => {
    departmentMap[dept.code] = dept._id;
});

    console.log("📚 Inserting Subjects...");
    const subjects = await Subject.insertMany(subjectData);

    const subjectMap = {};

    subjects.forEach((subject) => {
      subjectMap[subject.code] = subject._id;
    });


    console.log("👨‍🏫 Inserting Faculty...");


// Prepare faculty data
const facultyWithSubject = facultyData.map((faculty) => ({
    facultyName: faculty.name,
    designation: faculty.designation,
    subject: subjectMap[faculty.subjectCode],
    department: departmentMap["CSE-AI"],
}));

// Insert faculty
const faculties = await Faculty.insertMany(facultyWithSubject);

   const facultyMap = {};

faculties.forEach((faculty) => {
    facultyMap[faculty.facultyName] = faculty._id;
});

    console.log("🏫 Inserting Rooms...");

    const rooms = await Room.insertMany(roomData);

    const roomMap = {};

    rooms.forEach((room) => {
      roomMap[room.roomNo] = room._id;
    });

  
    console.log("🏫 Inserting Classes...");

const classes = await Class.insertMany(classData);

const classMap = {};

classes.forEach((cls) => {
    const key =
        `${cls.department}-${cls.semester}-${cls.section}-${cls.academicYear}`;

    classMap[key] = cls._id;
});

    console.log("👨‍🎓 Inserting Students...");

const students = studentData.map((student) => ({
    name: student.name,
    phone: student.phone,
    rollNo: student.rollNo,
    enrollmentNo: student.enrollmentNo,
    class:
        classMap[
            `${student.department}-${student.semester}-${student.section}-${student.academicYear}`
        ],
}));

await Student.insertMany(students);


  // ================= Seed Timetable =================

    for (const item of timetableData) {

      // Find Class
const classDoc = await Class.findOne({
  department: item.department,
  semester: item.semester,
  section: item.section,
  academicYear: item.academicYear,
});

if (!classDoc) {
  console.log(
    `Class not found: ${item.department}-${item.semester}-${item.section}-${item.academicYear}`
  );
  continue;
}

// Find Subject
const subjectDoc = await Subject.findOne({
  code: item.subjectCode,
});

  // Find Faculty
  const facultyDoc = item.facultyName
    ? await Faculty.findOne({
        facultyName: item.facultyName,
      })
    : null;

  // Find Room
  const roomDoc = await Room.findOne({
    roomNo: item.roomNo,
  });

  console.log({
  day: item.day,
  subjectCode: item.subjectCode,
  facultyName: item.facultyName,
  roomNo: item.roomNo,
  subjectFound: !!subjectDoc,
  facultyFound: !!facultyDoc,
  roomFound: !!roomDoc,
});
  // Create Timetable Entry
  await Timetable.create({
    class: classDoc._id,
    day: item.day,
    startTime: item.startTime,
    endTime: item.endTime,
    subject: subjectDoc ? subjectDoc._id : null,
    faculty: facultyDoc ? facultyDoc._id : null,
    room: roomDoc ? roomDoc._id : null,
  });
}

console.log("✅ Timetable Seeded");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();