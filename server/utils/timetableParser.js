// Parse BBDU-format timetable text files into structured timetable data.
//
// The file is a fixed-width pipe-delimited table:
//
//   Babu Banarasi Das University
//   School of Engineering
//   Department of Computer Science & Engineering
//   B.Tech Second Year, Odd Semester Academic Session: 2026-27
//   B.Tech CSE - III Sem | Section: CSAI-2B
//
//   Time/Day  | 09-10              | 10-11              | 11-12          | 12-1           | 1-2  | ...
//   ----------|--------------------|--------------------|----------------|----------------|------| ...
//   Mon       | P/DS/JY/Lab2       | P/DS/JY/Lab2       | LIB            | L/DM/ST/406    |  L   | ...
//
// Cells are token strings: TYPE/SUBJECT/FACULTY/ROOM, e.g.:
//   L/DM/ST/406   -> Lecture, subject key DM, faculty initials ST, room 406
//   P/DS/JY/Lab2  -> Practical, subject key DS, faculty initials JY, room Lab2
//   P/NSS/YOGA/VD/CH -> Practical with multi-part subject key (NSS/YOGA)
//   LIB           -> Library period
//   L / empty     -> Lunch / free period

const DAYS = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const ROMAN = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
};

const YEAR_ORDINAL = {
  First: 1,
  Second: 2,
  Third: 3,
  Fourth: 4,
  Fifth: 5,
  Sixth: 6,
  Seventh: 7,
  Eighth: 8,
};

// Department code derived from the section token prefix (e.g. "CSAI-2B" -> "CSE-AI").
// Codes are kept SOE-prefixed ("SOE-CSE-AI") to match the school's department naming.
const DEPARTMENT_CODE_ALIASES = {
  CSAI: "SOE-CSE-AI",
  "CSAI": "SOE-CSE-AI",
  "SOE-CSAI": "SOE-CSE-AI",
  CS: "SOE-CSE",
  "SOE-CS": "SOE-CSE",
  CSEAI: "SOE-CSE-AI",
  "SOE-CSEAI": "SOE-CSE-AI",
  ECE: "SOE-ECE",
  "SOE-ECE": "SOE-ECE",
  CSE: "SOE-CSE",
  "SOE-CSE": "SOE-CSE",
};

// Known subject keys -> course data. Used to resolve grid cell tokens even
// when the COURSE DETAILS table is missing or unparsable.
const KNOWN_SUBJECTS = {
  DS: { code: "NCS4352", name: "Data Structure Lab", credits: 1 },
  DSUC: { code: "NCS4302", name: "Data Structure using C", credits: 4 },
  DM: { code: "NCS4301", name: "Discrete Mathematics", credits: 3 },
  CAIT: {
    code: "NBS4301",
    name: "Complex Analysis and Integral Transforms",
    credits: 4,
  },
  AIMES: {
    code: "NAI4302",
    name: "Artificial Intelligence in Mechanical Engineering Systems",
    credits: 4,
  },
  DLD: { code: "NCS4303", name: "Digital Logic Design", credits: 3 },
  IS: { code: "NHS4302", name: "Industrial Sociology", credits: 2 },
  "NSS/YOGA": { code: "NCC4351", name: "NSS / YOGA", credits: 1 },
  GP: { code: "NGP4301", name: "General Proficiency", credits: 1 },
  LIB: { code: "LIB", name: "Library", credits: 0 },
};

// Known faculty initials -> full name.
const KNOWN_FACULTY = {
  JY: "Ms. Jyoti Yadav",
  ST: "Ms. Shraddha Tiwari",
  PS: "Dr. Priyanka Singh",
  SV: "Mr. Shailesh Vishwakarma",
  PK: "Dr. Priya Kumari",
  PV: "Dr. Pooja Verma",
  VD: "Ms. Veena Dwivedi",
};

const DAY_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(day)?$/i;
const SLOT_RE = /^\s*(\d{1,2})\s*[-–]\s*(\d{1,2})\s*(am|pm)?\s*$/i;
const COURSE_CODE_RE = /[A-Z]{2,4}\d{3,4}/;
const ROMAN_RE = /\b([IVX]+)\s*(?:nd|rd|th)?\s*Sem/i;
const SECTION_RE = /Section\s*[:=]\s*([A-Za-z0-9-]+)/i;
const YEAR_RE = /(20\d{2})\s*[-–]\s*(\d{2})/;

const normalize = (value) => String(value || "").trim();

const getPipePositions = (line) => {
  const positions = [];
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === "|") positions.push(index);
  }
  return positions;
};

const parseTimeSlot = (label) => {
  const match = normalize(label).match(SLOT_RE);
  if (!match) return null;

  let startHour = Number(match[1]);
  let endHour = Number(match[2]);
  const period = normalize(match[3]).toLowerCase();

  if (period === "pm") {
    if (startHour < 12) startHour += 12;
    if (endHour < 12) endHour += 12;
  } else if (startHour < 9) {
    // BBDU labels afternoon hours on a 12-hour clock (1-2, 2-3, 3-4, 4-5
    // mean 13-14, 14-15, 15-16, 16-17). Hours 1-8 therefore belong to PM.
    startHour += 12;
    endHour += 12;
  }

  // Handle crossing-noon ranges such as "12-1".
  if (endHour < startHour) endHour += 12;

  const pad = (hour) => `${String(hour).padStart(2, "0")}:00`;
  return { startTime: pad(startHour), endTime: pad(endHour) };
};

// Parse a grid cell token into { type, subjectKey, facultyInitials, room }.
const parseCellToken = (token) => {
  const value = normalize(token);
  if (!value) return null;

  if (/^LIB/i.test(value)) {
    return { type: "LIB", subjectKey: "LIB", facultyInitials: "", room: "" };
  }

  // Lunch letters (L / U / N / C / H / blank) -> not a class.
  if (/^[LUNCHlunch ]+$/.test(value) && value.length <= 5) return null;

  const parts = value.split("/");
  if (parts.length < 3) return null;

  const type = parts[0].toUpperCase();
  const room = normalize(parts[parts.length - 1]);
  const facultyInitials = normalize(parts[parts.length - 2]);
  const subjectKey = parts.slice(1, parts.length - 2).join("/");

  return { type, subjectKey, facultyInitials, room };
};

const extractMetadata = (lines) => {
  const metadata = {
    collegeName: "",
    school: "",
    departmentName: "",
    program: "",
    semester: null,
    academicYear: "",
    section: "",
    departmentCode: "",
  };

  const fullText = lines.join("\n");

  lines.forEach((rawLine) => {
    const line = normalize(rawLine);

    if (!metadata.collegeName && /University|Institute|College/i.test(line) && !/Department of|School of/i.test(line)) {
      metadata.collegeName = line;
    }

    if (/^School of/i.test(line)) metadata.school = line;
    if (/^Department of/i.test(line)) metadata.departmentName = line.replace(/^Department\s+of\s+/i, "");

    if (/B\.?Tech/i.test(line) && /\|/.test(line)) {
      metadata.program = line.split("|")[0].trim();
    }
  });

  const yearMatch = fullText.match(YEAR_RE);
  if (yearMatch) {
    metadata.academicYear = `${yearMatch[1]}-${yearMatch[2]}`;
  }

  const sectionMatch = fullText.match(SECTION_RE);
  if (sectionMatch) {
    const sectionToken = normalize(sectionMatch[1]);
    const dashIndex = sectionToken.lastIndexOf("-");
    const maybeSection = dashIndex > 0 ? sectionToken.slice(dashIndex + 1) : "";
    const maybeDept = dashIndex > 0 ? sectionToken.slice(0, dashIndex) : sectionToken;

    if (/\d[A-Za-z]$/.test(maybeSection)) {
      metadata.section = maybeSection;
      const alias = DEPARTMENT_CODE_ALIASES[maybeDept.toUpperCase()];
      metadata.departmentCode = alias || maybeDept;
    } else {
      metadata.section = sectionToken;
    }
  }

  const romanMatch = fullText.match(ROMAN_RE);
  if (romanMatch) {
    metadata.semester = ROMAN[romanMatch[1].toUpperCase()] || null;
  }

  if (!metadata.semester) {
    const semNumberMatch = fullText.match(/Sem\s*(\d+)/i) || fullText.match(/Semester\s*(\d+)/i);
    if (semNumberMatch) metadata.semester = Number(semNumberMatch[1]);
  }

  if (!metadata.semester) {
    const yearMatch2 = fullText.match(/\b(First|Second|Third|Fourth)\s+Year\b/i);
    if (yearMatch2) {
      const yearNumber = YEAR_ORDINAL[yearMatch2[1].toLowerCase()] || 0;
      const oddSemester = /Odd Semester/i.test(fullText);
      metadata.semester = yearNumber > 0 ? (yearNumber - 1) * 2 + (oddSemester ? 1 : 2) : null;
    }
  }

  return metadata;
};

// Extract a loose COURSE DETAILS table (code -> { code, name, credits, facultyName }).
// Each row maps a course to the faculty member who teaches it:
//   Credit | Code | Course Name | Meta Data | Faculty Name
// The Faculty Name column supplies full names for the grid's faculty initials.
const extractCourseDetails = (lines, gridEndIndex) => {
  const courses = {};
  const detailLines = lines.slice(gridEndIndex);

  let inDetails = false;

  detailLines.forEach((rawLine) => {
    const line = normalize(rawLine);

    if (!inDetails && /COURS|DETAILS/i.test(line)) {
      inDetails = true;
      return;
    }

    if (!inDetails || !line) return;

    const cells = line.split("|").map(normalize);

    const code = (cells[1] || "").match(COURSE_CODE_RE)?.[0];
    if (!code) return;

    const creditMatch = (cells[0] || "").match(/(\d+(?:\.\d+)?)/);

    courses[code] = {
      code,
      name: cells[2] || code,
      credits: creditMatch ? Number(creditMatch[1]) : 0,
      metaData: cells[3] || "",
      facultyName: cells[4] || "",
    };
  });

  return courses;
};

// Parse the timetable grid into per-day slot maps.
const parseGrid = (lines, timeSlots, startIndex) => {
  const grid = [];

  // Locate the header line's pipe boundaries for merged-cell resolution.
  let headerPipes = [];
  for (let index = startIndex - 1; index >= 0; index -= 1) {
    const line = lines[index];
    if (line.includes("|")) {
      headerPipes = getPipePositions(line);
      break;
    }
  }

  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const firstCell = normalize(line.split("|")[0]);

    // Skip the dashed separator row under the header.
    if (/^[-–—_= ]+$/.test(firstCell) && /[-–—_=]/.test(line)) continue;

    const dayMatch = firstCell.match(DAY_RE);
    if (!dayMatch) break;

    const dayLabel = dayMatch[1][0].toUpperCase() + dayMatch[1].slice(1).toLowerCase();
    const day = DAYS[dayLabel];
    if (!day) break;

    const row = { day, cells: new Array(timeSlots.length).fill("") };
    const body = line
      .split("|")
      .slice(1)
      .map((cell) => cell.trim());

    if (body.length === timeSlots.length) {
      // Fast path: one cell per time slot, no merged cells.
      body.forEach((token, slotIndex) => {
        row.cells[slotIndex] = token;
      });
    } else {
      // Merged cells span multiple header columns. Match each cell to the
      // time-slot columns it spatially overlaps (>= 50% of the column width).
      // Slot `i` occupies headerPipes[i] .. headerPipes[i+1].
      const rowPipes = getPipePositions(line);
      const boundaries = [...rowPipes, line.length];

      for (let cellIndex = 0; cellIndex < boundaries.length - 1; cellIndex += 1) {
        const cellStart = boundaries[cellIndex];
        const cellEnd = boundaries[cellIndex + 1];
        const text = line.slice(cellStart + 1, cellEnd).trim();
        if (!text) continue;

        for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex += 1) {
          const columnStart = headerPipes[slotIndex];
          const columnEnd = headerPipes[slotIndex + 1] ?? line.length;
          const columnWidth = columnEnd - columnStart;
          if (columnWidth <= 0) continue;

          const overlap = Math.min(cellEnd, columnEnd) - Math.max(cellStart, columnStart);
          if (overlap >= columnWidth * 0.5) {
            row.cells[slotIndex] = text;
          }
        }
      }
    }

    grid.push(row);
  }

  return grid;
};

// Collapse a row's slot cells into contiguous class entries.
const buildEntries = (row, timeSlots, courseDetails) => {
  const entries = [];
  let current = null;

  const flush = () => {
    if (!current) return;

    const firstSlot = current.slots[0];
    const lastSlot = current.slots[current.slots.length - 1];
    const token = parseCellToken(current.token);

    if (!token) {
      current = null;
      return;
    }

    const subject = resolveSubject(token.subjectKey, courseDetails);
    const courseFaculty = subject.code ? courseDetails[subject.code]?.facultyName : "";

    entries.push({
      day: row.day,
      startTime: firstSlot.startTime,
      endTime: lastSlot.endTime,
      subjectCode: subject.code,
      subjectName: subject.name,
      facultyName:
        token.type === "LIB"
          ? ""
          : courseFaculty || KNOWN_FACULTY[token.facultyInitials] || token.facultyInitials,
      facultyInitials: token.facultyInitials,
      roomNo: token.room,
      type: token.type,
    });

    current = null;
  };

  row.cells.forEach((token, index) => {
    if (!normalize(token)) {
      flush();
      return;
    }

    if (current && current.token === token) {
      current.slots.push(timeSlots[index]);
    } else {
      flush();
      current = { token, slots: [timeSlots[index]] };
    }
  });

  flush();
  return entries;
};

const resolveSubject = (subjectKey, courseDetails) => {
  const known = KNOWN_SUBJECTS[subjectKey];

  if (known) {
    const detailed = courseDetails[known.code];
    return {
      code: known.code,
      name: detailed?.name || known.name,
      credits: detailed?.credits || known.credits,
    };
  }

  const code = subjectKey.toUpperCase();
  const detailed = courseDetails[code];
  return {
    code,
    name: detailed?.name || subjectKey,
    credits: detailed?.credits || 0,
  };
};

const parseTimetableText = (text) => {
  const lines = String(text || "").replace(/\r/g, "").split("\n");

  // Locate the header row that defines the time slots.
  let headerIndex = -1;
  let timeSlots = [];

  lines.forEach((line, index) => {
    if (headerIndex >= 0) return;

    const cells = line.split("|").map(normalize);
    if (cells.length >= 2 && /^(Time\/Day|Day|Time|Days)$/i.test(cells[0]) && cells.some((cell) => SLOT_RE.test(cell))) {
      headerIndex = index;
      timeSlots = cells.slice(1).map(parseTimeSlot).filter(Boolean);
    }
  });

  if (headerIndex < 0) {
    throw new Error("Could not locate the timetable grid header (Time/Day row).");
  }

  const metadata = extractMetadata(lines);
  const grid = parseGrid(lines, timeSlots, headerIndex + 1);

  const gridEndIndex = headerIndex + 1 + grid.length;
  const courseDetails = extractCourseDetails(lines, gridEndIndex);

  const entries = grid.flatMap((row) => buildEntries(row, timeSlots, courseDetails));

  const rooms = [...new Set(entries.map((entry) => entry.roomNo).filter(Boolean))];
  const facultyNames = [...new Set(entries.map((entry) => entry.facultyName).filter(Boolean))];

  return {
    metadata,
    timeSlots,
    grid,
    courseDetails: Object.values(courseDetails),
    rooms,
    facultyNames,
    entries,
  };
};

module.exports = {
  parseTimetableText,
  extractMetadata,
  DAYS,
  KNOWN_SUBJECTS,
  KNOWN_FACULTY,
  DEPARTMENT_CODE_ALIASES,
  SLOT_RE,
  SECTION_RE,
  YEAR_RE,
  ROMAN,
  YEAR_ORDINAL,
  normalize,
};
