const College = require("../models/College");
const Department = require("../models/Department");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Faculty = require("../models/Faculty");
const Room = require("../models/Room");

const DEFAULT_COLLEGE = {
  code: "BBDU",
  name: "Babu Banarasi Das University",
  location: "Faizabad Road, Lucknow",
};

// Infer a room's floor/wing/block from its room number.
const inferRoomDetails = (roomNo) => {
  const normalized = String(roomNo || "").trim();

  if (/^LGF/i.test(normalized)) {
    return { floor: "LGF", wing: "Wing A", block: "University Building" };
  }

  if (/^UGF/i.test(normalized)) {
    return { floor: "UGF", wing: "Wing A", block: "University Building" };
  }

  if (/^Lab/i.test(normalized)) {
    return { floor: "Lab", wing: "Wing A", block: "University Building" };
  }

  if (/^CH$/i.test(normalized)) {
    return { floor: "Ground", wing: "Wing A", block: "University Building" };
  }

  const floorMatch = normalized.match(/^(\d)/);
  if (floorMatch) {
    const floorNumber = Number(floorMatch[1]);
    return {
      floor: floorNumber === 0 ? "Ground" : `${floorNumber}th Floor`,
      wing: "Wing A",
      block: "University Building",
    };
  }

  return { floor: "Ground", wing: "Wing A", block: "University Building" };
};

const upsertCollege = async (name) => {
  const collegeName = String(name || "").trim() || DEFAULT_COLLEGE.name;

  let college = await College.findOne({ name: collegeName });

  if (!college) {
    const existing = await College.findOne({ code: DEFAULT_COLLEGE.code });
    if (existing) return existing;

    college = await College.create({
      code: DEFAULT_COLLEGE.code,
      name: collegeName,
      location: DEFAULT_COLLEGE.location,
    });
  }

  return college;
};

const upsertDepartment = async (college, code, name) => {
  let department = null;

  if (code) {
    department = await Department.findOne({ code });
  }

  if (!department && !code && name) {
    department = await Department.findOne({ name });
  }

  if (!department) {
    department = await Department.create({
      code: code || (name || "DEPT").slice(0, 20).toUpperCase(),
      name: name || code || "Department",
      college: college._id,
    });
  }

  return department;
};

const upsertClass = async (college, department, metadata) => {
  const departmentCode = department.code;
  const semester = metadata.semester || 1;
  const section = metadata.section || "A";
  const academicYear = metadata.academicYear || "2026-27";

  let classDoc = await Class.findOne({
    department: departmentCode,
    semester,
    section,
    academicYear,
  });

  if (!classDoc) {
    classDoc = await Class.create({
      department: departmentCode,
      semester,
      section,
      academicYear,
      college: college._id,
    });
  }

  return classDoc;
};

const upsertSubject = async (subject) => {
  let subjectDoc = await Subject.findOne({ code: subject.code });
  if (!subjectDoc) {
    subjectDoc = await Subject.create({
      code: subject.code,
      name: subject.name,
      credits: subject.credits || 0,
    });
  }
  return subjectDoc;
};

// Derive capitalized initials from a full name ("Mr. Naseem Ahamad Khan" -> "NAK").
const nameInitials = (name) =>
  String(name || "")
    .replace(/^(mr|ms|mrs|dr|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();

const upsertFaculty = async (college, department, name, subjectId) => {
  if (!name) return null;

  let faculty = await Faculty.findOne({ facultyName: name });

  if (!faculty) {
    // The import may now provide a full name while an earlier import stored the
    // record under its initials (e.g. "NAK"). Reuse that record and correct the
    // name instead of creating a duplicate. Initials are A-Z only, so no regex
    // escaping is needed.
    const initials = nameInitials(name);
    if (initials) {
      faculty = await Faculty.findOne({
        facultyName: new RegExp(`^${initials}$`, "i"),
      });
    }
  }

  if (!faculty) {
    faculty = await Faculty.create({
      facultyName: name,
      designation: "Assistant Professor",
      subject: subjectId,
      department: department._id,
      college: college._id,
    });
  } else if (faculty.facultyName !== name) {
    faculty.facultyName = name;
    if (subjectId) faculty.subject = subjectId;
    await faculty.save();
  }

  return faculty;
};

const upsertRoom = async (college, department, roomNo) => {
  if (!roomNo) return null;

  let room = await Room.findOne({ roomNo });

  if (!room) {
    const details = inferRoomDetails(roomNo);
    room = await Room.create({
      roomNo,
      floor: details.floor,
      wing: details.wing,
      block: details.block,
      department: department._id,
      college: college._id,
    });
  }

  return room;
};

// Build a display string for the class label.
const classLabel = (classDoc) =>
  `${classDoc.department} · Sem ${classDoc.semester} · Sec ${classDoc.section}`;

module.exports = {
  DEFAULT_COLLEGE,
  inferRoomDetails,
  upsertCollege,
  upsertDepartment,
  upsertClass,
  upsertSubject,
  upsertFaculty,
  upsertRoom,
  classLabel,
};
