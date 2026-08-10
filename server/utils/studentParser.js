// Parse BBDU student lists (tab-separated, e.g. copied from Excel) into
// structured student data.
//
// The file has the same header block as a timetable:
//
//   Babu Banarasi Das University
//   School of Engineering
//   Department of Computer Science & Engineering
//   B.Tech Second Year, Odd Semester Academic Session: 2026-27
//   B.Tech CSE - III Sem | Section: CSAI-2B
//
// followed by a tab-separated table:
//
//   S.No  Name                Enrollment No   University Roll No  Phone        Email
//   1     Shubham Kumar Gupta  EN231001        23CSAI001           9876543210   shubham@bbdu.ac.in
//
// Column headers are matched flexibly (Roll No / RollNo / University Roll No, etc.).

const { extractMetadata, normalize } = require("./timetableParser");

const COLUMN_ALIASES = {
  serial: [/^s\.?no\.?$/i, /^sl\.?no\.?$/i, /^sr\.?no\.?$/i, /^#$/],
  name: [/^name/i, /^student/i, /^candidate/i],
  rollNo: [/roll\s*no/i, /rollno/i, /university\s*roll/i],
  enrollmentNo: [/enroll/i, /enrolment/i, /admission/i],
  phone: [/phone/i, /mobile/i, /contact/i, /mob/i],
  email: [/email/i, /e-?mail/i],
};

const resolveColumnIndexes = (headerCells) => {
  const indexes = {};

  headerCells.forEach((cell, index) => {
    const label = normalize(cell);
    if (!label) return;

    for (const [field, patterns] of Object.entries(COLUMN_ALIASES)) {
      if (field in indexes) continue;
      if (patterns.some((pattern) => pattern.test(label))) {
        indexes[field] = index;
        break;
      }
    }
  });

  return indexes;
};

const parseStudentText = (text) => {
  const lines = String(text || "").replace(/\r/g, "").split("\n");

  // Locate the tab-separated header row.
  let headerIndex = -1;
  let indexes = null;

  lines.forEach((line, index) => {
    if (headerIndex >= 0) return;

    const cells = line.split("\t").map(normalize).filter(Boolean);
    if (cells.length < 2) return;

    const candidate = resolveColumnIndexes(cells);
    if (!candidate.name && !candidate.rollNo) return;
    if (!candidate.name) return;

    headerIndex = index;
    indexes = candidate;
  });

  if (headerIndex < 0) {
    throw new Error(
      "Could not locate the student table header. Make sure it has Name and Roll No columns separated by tabs."
    );
  }

  const headerCells = lines[headerIndex].split("\t").map(normalize);
  const metadata = extractMetadata(lines);

  const students = [];

  for (let index = headerIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const cells = line.split("\t").map(normalize);

    if (cells.length < 2) continue;

    const get = (field) => (indexes[field] !== undefined ? cells[indexes[field]] : "");

    const name = get("name");
    const rollNo = get("rollNo");

    if (!name || !rollNo) continue;

    students.push({
      name,
      rollNo,
      enrollmentNo: get("enrollmentNo"),
      phone: get("phone"),
      email: get("email"),
    });
  }

  return {
    metadata,
    header: headerCells,
    students,
  };
};

module.exports = {
  parseStudentText,
  resolveColumnIndexes,
  COLUMN_ALIASES,
};
