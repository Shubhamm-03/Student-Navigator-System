const Student = require("../models/Student");
const {
  upsertCollege,
  upsertDepartment,
  upsertClass,
  classLabel,
} = require("../utils/upsertHelpers");
const { parseStudentText } = require("../utils/studentParser");

const importStudents = async (req, res) => {
  try {
    const text = req.body?.text;

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        success: false,
        message: "No student data provided.",
      });
    }

    const parsed = parseStudentText(text);

    if (!parsed.students.length) {
      return res.status(400).json({
        success: false,
        message: "No students could be parsed from the data. Please check the file format.",
      });
    }

    const { metadata } = parsed;

    // 1. Resolve (or create) College / Department / Class from the header block.
    const college = await upsertCollege(metadata.collegeName);
    const department = await upsertDepartment(college, metadata.departmentCode, metadata.departmentName);
    const classDoc = await upsertClass(college, department, metadata);

    // 2. Upsert students by roll number so re-imports update in place.
    const created = [];
    const updated = [];

    for (const student of parsed.students) {
      const existing = await Student.findOne({ rollNo: student.rollNo });

      const payload = {
        name: student.name,
        rollNo: student.rollNo,
        phone: student.phone,
        enrollmentNo: student.enrollmentNo || "",
        email: student.email || "",
        class: classDoc._id,
        college: college._id,
        department: department._id,
      };

      if (existing) {
        await Student.updateOne({ _id: existing._id }, { $set: payload });
        updated.push(student.rollNo);
      } else {
        await Student.create(payload);
        created.push(student.rollNo);
      }
    }

    const existingCount = await Student.countDocuments({ class: classDoc._id });

    res.status(201).json({
      success: true,
      message: `Imported ${parsed.students.length} students into ${classLabel(classDoc)}.`,
      summary: {
        college: college.name,
        department: department.code,
        class: classLabel(classDoc),
        semester: classDoc.semester,
        section: classDoc.section,
        academicYear: classDoc.academicYear,
        studentsImported: parsed.students.length,
        created: created.length,
        updated: updated.length,
        totalStudentsInClass: existingCount,
        header: parsed.header,
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
  importStudents,
};
