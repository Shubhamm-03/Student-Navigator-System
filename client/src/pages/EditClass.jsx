import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGraduationCap,
  FaSave,
  FaUserGraduate,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import api from "../api/axios";

const classLabel = (item) => {
  if (!item) return "Unassigned";
  return `${item.department} · Sem ${item.semester} · Sec ${item.section} · ${item.academicYear}`;
};

const selectClassNames =
  "w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 py-3.5 px-4 text-center text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60";

const EditClass = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isActive = true;

    Promise.all([
      api.get("/students/profile"),
      api.get("/classes"),
    ])
      .then(([profileRes, classesRes]) => {
        if (!isActive) return;

        const current = profileRes.data.student.class;
        setCurrentClass(current);
        setClasses(classesRes.data.data || []);

        if (current) {
          setDepartment(current.department);
          setSemester(String(current.semester));
          setSection(current.section);
          setAcademicYear(current.academicYear);
        }
      })
      .catch((err) => {
        if (isActive) {
          setError("Failed to load your academic information. Please try again.");
          console.log(err);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const departments = [...new Set(classes.map((item) => item.department))].sort();

  const semesters = department
    ? [...new Set(
        classes
          .filter((item) => item.department === department)
          .map((item) => item.semester)
      )].sort((a, b) => a - b)
    : [];

  const sections = department && semester
    ? [...new Set(
        classes
          .filter((item) => item.department === department && String(item.semester) === semester)
          .map((item) => item.section)
      )].sort()
    : [];

  const academicYears = department && semester && section
    ? [...new Set(
        classes
          .filter((item) => item.department === department && String(item.semester) === semester && item.section === section)
          .map((item) => item.academicYear)
      )].sort()
    : [];

  const onDepartmentChange = (value) => {
    setDepartment(value);
    setSemester("");
    setSection("");
    setAcademicYear("");
  };

  const onSemesterChange = (value) => {
    setSemester(value);
    setSection("");
    setAcademicYear("");
  };

  const onSectionChange = (value) => {
    setSection(value);
    setAcademicYear("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!department || !semester || !section || !academicYear) {
      setError("Please select all academic fields.");
      return;
    }

    const match = classes.find(
      (item) =>
        item.department === department &&
        String(item.semester) === semester &&
        item.section === section &&
        item.academicYear === academicYear
    );

    if (!match) {
      setError("No class matches the selected combination.");
      return;
    }

    if (match._id === currentClass?._id) {
      setError("This is already your current academic information.");
      return;
    }

    setSaving(true);

    try {
      const res = await api.put("/students/profile/class", { classId: match._id });
      setCurrentClass(res.data.student.class);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update academic information.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>

      {/* Page Header */}
      <div className="mb-8">
        <Link
          to="/profile"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 transition hover:text-indigo-700"
        >
          <FaArrowLeft /> Back to Profile
        </Link>

        <h1 className="flex items-center gap-3 text-4xl font-bold text-slate-900 dark:text-white">
          <FaGraduationCap className="text-indigo-500" /> Edit Academic Info
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Update your department, semester, section, and academic year.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <Loader />
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Loading academic information...
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-8 py-8 text-center text-white">
            <p className="text-xs uppercase tracking-[4px] opacity-90">
              Change Academic Information
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Your schedule and dashboard will update automatically.
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-8 text-center">

            {/* Current Class */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Current Class
              </label>
              <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 py-3.5 text-slate-900 dark:text-white">
                <FaUserGraduate className="text-green-600" />
                <span className="font-semibold">{classLabel(currentClass)}</span>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className={selectClassNames}
              >
                <option value="">Select department</option>
                {departments.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => onSemesterChange(e.target.value)}
                disabled={!department}
                className={selectClassNames}
              >
                <option value="">
                  {department ? "Select semester" : "Select department first"}
                </option>
                {semesters.map((item) => (
                  <option key={item} value={String(item)}>Semester {item}</option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => onSectionChange(e.target.value)}
                disabled={!semester}
                className={selectClassNames}
              >
                <option value="">
                  {semester ? "Select section" : "Select semester first"}
                </option>
                {sections.map((item) => (
                  <option key={item} value={item}>Section {item}</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                disabled={!section}
                className={selectClassNames}
              >
                <option value="">
                  {section ? "Select academic year" : "Select section first"}
                </option>
                {academicYears.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300"
              >
                <FaExclamationTriangle />
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300"
              >
                <FaCheckCircle />
                {success}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-row-reverse">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSave />
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-600 px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

    </MainLayout>
  );
};

export default EditClass;
