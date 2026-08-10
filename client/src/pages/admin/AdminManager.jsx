import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCheck,
  FaEdit,
  FaExclamationTriangle,
  FaEye,
  FaFileImport,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import api from "../../api/axios";
import AdminLayout from "../../components/admin/AdminLayout";

const classLabel = (item) => {
  if (!item) return "Unassigned";
  return `${item.department} · Sem ${item.semester} · Sec ${item.section}`;
};

const initials = (name) =>
  (name || "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const displayValue = (item, field) => {
  const value = item[field];
  if (field === "class") return classLabel(value);
  if (field === "subject") return value ? `${value.code} — ${value.name}` : "Unassigned";
  if (field === "faculty") return value?.facultyName || "Unassigned";
  if (field === "room") return value?.roomNo || "Unassigned";
  if (field === "department" && typeof value === "object") return value?.code || "Unassigned";
  if (field === "college") return value?.name || "Unassigned";
  if (field === "academicYear") return value || "—";
  return value ?? "—";
};

const resourceConfig = {
  students: {
    title: "Students",
    singular: "student",
    subtitle: "Maintain the student directory and class assignments.",
    columns: [["name", "Student"], ["rollNo", "University Roll No."], ["enrollmentNo", "Enrollment no"], ["phone", "Phone"], ["class", "Class"], ["department", "Department"], ["college", "College"]],
    fields: [
      { name: "college", label: "College", required: true, options: (catalog) => catalog.colleges.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "department", label: "Department", required: true, options: (catalog) => catalog.departments.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "class", label: "Class", required: true, options: (catalog) => catalog.classes.map((item) => [item._id, classLabel(item)]) },
      { name: "name", label: "Full name", required: true },
      { name: "rollNo", label: "University Roll No.", required: true },
      { name: "enrollmentNo", label: "Enrollment number", placeholder: "e.g. EN231001" },
      { name: "email", label: "Email address", type: "email", placeholder: "e.g. student@college.edu" },
      { name: "phone", label: "Phone number", required: true, type: "tel" },
    ],
  },
  faculty: {
    title: "Faculty",
    singular: "faculty member",
    subtitle: "Assign teaching staff to their subjects and departments.",
    columns: [["facultyName", "Faculty member"], ["designation", "Designation"], ["subject", "Subject"], ["department", "Department"], ["college", "College"]],
    fields: [
      { name: "college", label: "College", required: true, options: (catalog) => catalog.colleges.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "department", label: "Department", required: true, options: (catalog) => catalog.departments.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "facultyName", label: "Full name", required: true },
      { name: "designation", label: "Designation", required: true, placeholder: "e.g. Assistant Professor" },
      { name: "subject", label: "Primary subject", required: true, options: (catalog) => catalog.subjects.map((item) => [item._id, `${item.code} — ${item.name}`]) },
    ],
  },
  classes: {
    title: "Classes",
    singular: "class",
    subtitle: "Create class cohorts before assigning students and schedules.",
    columns: [["department", "Department"], ["semester", "Semester"], ["section", "Section"], ["academicYear", "Academic year"], ["college", "College"]],
    fields: [
      { name: "college", label: "College", required: true, options: (catalog) => catalog.colleges.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "department", label: "Department", required: true, options: (catalog) => catalog.departments.map((item) => [item.code, `${item.code} — ${item.name}`]) },
      { name: "semester", label: "Semester", required: true, type: "number", min: 1, max: 8 },
      { name: "section", label: "Section", required: true, placeholder: "e.g. A" },
      { name: "academicYear", label: "Academic year", required: true, placeholder: "e.g. 2026-27" },
    ],
  },
  rooms: {
    title: "Rooms",
    singular: "room",
    subtitle: "Keep classroom locations accurate for every timetable entry.",
    columns: [["roomNo", "Room"], ["block", "Block"], ["floor", "Floor"], ["wing", "Wing"], ["department", "Department"], ["college", "College"]],
    fields: [
      { name: "college", label: "College", required: true, options: (catalog) => catalog.colleges.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "department", label: "Department", required: true, options: (catalog) => catalog.departments.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "roomNo", label: "Room number", required: true, placeholder: "e.g. B-204" },
      { name: "block", label: "Block", required: true, placeholder: "e.g. Academic Block B" },
      { name: "floor", label: "Floor", required: true, options: () => [["First Floor", "First Floor"], ["Second Floor", "Second Floor"], ["Third Floor", "Third Floor"], ["Fourth Floor", "Fourth Floor"], ["Fifth Floor", "Fifth Floor"], ["Sixth Floor", "Sixth Floor"], ["Seventh Floor", "Seventh Floor"], ["Eighth Floor", "Eighth Floor"], ["UGF", "UGF"], ["LGF", "LGF"]] },
      { name: "wing", label: "Wing", required: true, options: () => [["Wing A", "Wing A"], ["Wing B", "Wing B"], ["Wing C", "Wing C"]] },
    ],
  },
  timetable: {
    title: "Timetable",
    singular: "schedule entry",
    filterable: true,
    subtitle: "Connect each class to the right subject, faculty member, room, and time.",
    columns: [["day", "Day"], ["startTime", "Starts"], ["endTime", "Ends"], ["class", "Class"], ["subject", "Subject"], ["room", "Room"], ["college", "College"], ["department", "Department"]],
    fields: [
      { name: "college", label: "College", required: true, options: (catalog) => catalog.colleges.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "department", label: "Department", required: true, options: (catalog) => catalog.departments.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "class", label: "Class", required: true, options: (catalog) => catalog.classes.map((item) => [item._id, classLabel(item)]) },
      { name: "day", label: "Day", required: true, options: () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => [day, day]) },
      { name: "startTime", label: "Start time", required: true, type: "time" },
      { name: "endTime", label: "End time", required: true, type: "time" },
      { name: "subject", label: "Subject", options: (catalog) => catalog.subjects.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "faculty", label: "Faculty", options: (catalog) => catalog.faculty.map((item) => [item._id, item.facultyName]) },
      { name: "room", label: "Room", options: (catalog) => catalog.rooms.map((item) => [item._id, `${item.roomNo} — ${item.block}`]) },
    ],
  },
  subjects: {
    title: "Subjects",
    singular: "subject",
    subtitle: "Create the subject catalogue used by faculty and class schedules.",
    columns: [["code", "Code"], ["name", "Subject name"], ["credits", "Credits"]],
    fields: [
      { name: "code", label: "Subject code", required: true, placeholder: "e.g. NCS4302" },
      { name: "name", label: "Subject name", required: true },
      { name: "credits", label: "Credits", required: true, type: "number", min: 0, step: 1 },
    ],
  },
  departments: {
    title: "Departments",
    singular: "department",
    subtitle: "Set up departments before creating faculty members and class cohorts.",
    columns: [["code", "Code"], ["name", "Department name"], ["college", "College"]],
    fields: [
      { name: "college", label: "College", required: true, options: (catalog) => catalog.colleges.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "code", label: "Department code", required: true, placeholder: "e.g. CSE-AI" },
      { name: "name", label: "Department name", required: true },
    ],
  },
  colleges: {
    title: "Colleges",
    singular: "college",
    subtitle: "Maintain the list of colleges under your university.",
    editable: false,
    columns: [["code", "Code"], ["name", "College name"], ["location", "Location"]],
    fields: [
      { name: "code", label: "College code", required: true, placeholder: "e.g. BBDEC" },
      { name: "name", label: "College name", required: true, placeholder: "e.g. Babu Banarasi Das College of Engineering" },
      { name: "location", label: "Location", placeholder: "e.g. Faizabad Road, Lucknow" },
    ],
  },
  admins: {
    title: "Administrators",
    singular: "administrator",
    subtitle: "Create and manage the accounts allowed to sign in to this console.",
    columns: [["name", "Name"], ["email", "Email"], ["role", "Role"]],
    fields: [
      { name: "name", label: "Full name", required: true },
      { name: "email", label: "Email address", required: true, type: "email" },
      { name: "password", label: "Password", required: true, type: "password", placeholder: "Minimum 6 characters", password: true, hideInView: true },
      { name: "role", label: "Role", options: () => [["admin", "Admin"]] },
    ],
  },
};

const importSpecs = {
  timetable: {
    title: "Import timetable",
    description: "Paste BBDU timetable text or upload a .txt file. It is parsed automatically and existing entries for that class are replaced.",
    endpoint: "/admin/timetable/import",
    fileLabel: "TXT files containing the BBDU timetable grid",
    textLabel: "Or paste the timetable text",
    accept: ".txt,text/plain",
    placeholder: "Babu Banarasi Das University\nSchool of Engineering\n...\n\nTime/Day | 09-10 | 10-11 | ...\nMon     | L/DM/ST/406 | ...",
    buttonLabel: "Import timetable",
  },
  students: {
    title: "Import students",
    description: "Paste tab-separated student data or upload a .txt/.tsv file. The header block (college, department, section) is parsed automatically; students are added to that class and existing roll numbers are updated.",
    endpoint: "/admin/students/import",
    fileLabel: "TXT / TSV files with tab-separated student rows",
    textLabel: "Or paste the student table",
    accept: ".txt,.tsv,text/plain",
    placeholder: "Babu Banarasi Das University\nSchool of Engineering\nDepartment of Computer Science & Engineering\n... | Section: CSAI-2B\n\nS.No\tName\tEnrollment No\tUniversity Roll No\tPhone\tEmail\n1\tShubham Kumar Gupta\tEN231001\t23CSAI001\t9876543210\t...",
    buttonLabel: "Import students",
  },
};

const EmptyState = ({ title, onAdd }) => (
  <div className="px-6 py-16 text-center">
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-xl text-indigo-600"><FaExclamationTriangle /></div>
    <h3 className="mt-4 font-bold text-slate-800">No {title.toLowerCase()} yet</h3>
    <p className="mt-1 text-sm text-slate-500">Create the first record to get started.</p>
    <button type="button" onClick={onAdd} className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Add record</button>
  </div>
);

const AdminManager = () => {
  const { resource } = useParams();
  const navigate = useNavigate();
  const config = resourceConfig[resource];
  const importSpec = importSpecs[resource];
  const [records, setRecords] = useState([]);
  const [catalog, setCatalog] = useState({ classes: [], subjects: [], departments: [], faculty: [], rooms: [], colleges: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [filters, setFilters] = useState({ college: "", department: "", class: "", section: "" });
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!config) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setNotice(null);
      try {
        const params = new URLSearchParams();
        if (filters.college) params.set("college", filters.college);
        if (filters.department) params.set("department", filters.department);
        if (filters.class) params.set("class", filters.class);
        if (filters.section) params.set("section", filters.section);

        const queryString = params.toString();
        const [recordsResponse, catalogResponse] = await Promise.all([
          api.get(`/admin/${resource}${queryString ? `?${queryString}` : ""}`),
          api.get("/admin/catalog"),
        ]);
        setRecords(recordsResponse.data.data || []);
        setCatalog(catalogResponse.data.catalog);
      } catch (requestError) {
        setNotice({ type: "error", message: requestError.response?.data?.message || "Unable to load records." });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [resource, config, navigate, filters.college, filters.department, filters.class, filters.section]);

  const filterOptions = useMemo(() => {
    const collegeId = filters.college;
    const departmentId = filters.department;

    const colleges = catalog.colleges;

    const departments = catalog.departments.filter(
      (department) => !collegeId || String(department.college?._id || department.college) === collegeId
    );

    const selectedDepartment = departments.find((department) => String(department._id) === departmentId);

    let classes = catalog.classes.filter(
      (item) => !collegeId || String(item.college?._id || item.college) === collegeId
    );

    classes = classes.filter(
      (item) => !selectedDepartment || String(item.department) === selectedDepartment.code
    );

    const sections = [...new Set(classes.map((item) => item.section).filter(Boolean))];

    return { colleges, departments, classes, sections };
  }, [catalog, filters.college, filters.department]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const matchesFilters = (record) => {
      const recordCollege = record.college?._id || record.college || "";
      const recordDepartment = record.department?._id || record.department || "";
      const recordClass = record.class?._id || record.class || "";
      const recordSection = record.class?.section;

      if (filters.college && String(recordCollege) !== filters.college) return false;
      if (filters.department && String(recordDepartment) !== filters.department) return false;
      if (filters.class && String(recordClass) !== filters.class) return false;
      if (filters.section && String(recordSection) !== filters.section) return false;
      return true;
    };

    const matchesQuery = (record) =>
      config.columns.some(([field]) => String(displayValue(record, field)).toLowerCase().includes(normalizedQuery));

    return records.filter((record) => matchesFilters(record) && (!normalizedQuery || matchesQuery(record)));
  }, [records, query, config, filters]);

  const openCreate = () => {
    setForm(Object.fromEntries(config.fields.map((field) => [field.name, ""])));
    setModal({ mode: "create" });
  };

  const openView = (record) => {
    setModal({ mode: "view", record });
  };

  const openEdit = (record) => {
    setForm(Object.fromEntries(config.fields.map((field) => {
      const value = record[field.name];
      return [field.name, typeof value === "object" && value ? value._id : value ?? ""];
    })));
    setModal({ mode: "edit", record });
  };

  const closeModal = () => {
    if (!saving) setModal(null);
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== ""));
    try {
      const response = modal.mode === "edit"
        ? await api.put(`/admin/${resource}/${modal.record._id}`, payload)
        : await api.post(`/admin/${resource}`, payload);
      const saved = response.data.data;
      setRecords((current) => modal.mode === "edit"
        ? current.map((record) => (record._id === saved._id ? saved : record))
        : [saved, ...current]);
      setNotice({ type: "success", message: response.data.message });
      setModal(null);
    } catch (requestError) {
      setNotice({ type: "error", message: requestError.response?.data?.message || "Unable to save this record." });
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (record) => {
    const label = displayValue(record, config.columns[0][0]);
    if (!window.confirm(`Delete “${label}”? This action cannot be undone.`)) return;

    setNotice(null);
    try {
      const { data } = await api.delete(`/admin/${resource}/${record._id}`);
      setRecords((current) => current.filter((item) => item._id !== record._id));
      setNotice({ type: "success", message: data.message });
    } catch (requestError) {
      setNotice({ type: "error", message: requestError.response?.data?.message || "Unable to delete this record." });
    }
  };

  const openImport = () => {
    setImportText("");
    setImportOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImportText(String(reader.result || ""));
    reader.readAsText(file);
  };

  const submitImport = async (event) => {
    event.preventDefault();
    if (!importText.trim()) return;

    setImporting(true);
    setNotice(null);
    try {
      const { data } = await api.post(importSpec.endpoint, { text: importText });
      setNotice({ type: "success", message: data.message });
      setImportOpen(false);
      setImportText("");

      const recordsResponse = await api.get(`/admin/${resource}`);
      setRecords(recordsResponse.data.data || []);
    } catch (requestError) {
      setNotice({ type: "error", message: requestError.response?.data?.message || "Unable to import this timetable." });
    } finally {
      setImporting(false);
    }
  };

  if (!config) return null;

  return (
    <AdminLayout
      title={config.title}
      subtitle={config.subtitle}
      action={
        <div className="flex flex-wrap items-center gap-2">
          {importSpec && (
            <button type="button" onClick={openImport} className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50">
              <FaFileImport className="text-xs" />
              <span className="hidden sm:inline">Import {config.singular}</span>
              <span className="sm:hidden">Import</span>
            </button>
          )}
          <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700">
            <FaPlus className="text-xs" />
            <span className="hidden sm:inline">Add {config.singular}</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      }
    >
      {notice && (
        <div className={`mb-5 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${notice.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          <span className="flex items-center gap-2">{notice.type === "error" ? <FaExclamationTriangle /> : <FaCheck />}{notice.message}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notification"><FaTimes /></button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="font-bold text-slate-900">All {config.title.toLowerCase()}</p>
            <p className="mt-1 text-sm text-slate-500">{records.length} total record{records.length === 1 ? "" : "s"}</p>
          </div>
          <label className={`relative block w-full sm:w-72 ${config.filterable ? "hidden" : ""}`}>
            <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${config.title.toLowerCase()}...`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </label>
        </div>

        {config.filterable && (
          <div className="border-b border-slate-100 bg-slate-50/60 p-5 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-5">
                <label className="block text-sm font-semibold text-slate-700">
                  College
                  <select
                    value={filters.college}
                    onChange={(event) => setFilters((current) => ({ ...current, college: event.target.value, department: "", class: "", section: "" }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value="">All colleges</option>
                    {filterOptions.colleges.map((college) => (
                      <option key={college._id} value={college._id}>{college.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Department
                  <select
                    value={filters.department}
                    onChange={(event) => setFilters((current) => ({ ...current, department: event.target.value, class: "", section: "" }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value="">All departments</option>
                    {filterOptions.departments.map((department) => (
                      <option key={department._id} value={department._id}>{department.code}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Class
                  <select
                    value={filters.class}
                    onChange={(event) => setFilters((current) => ({ ...current, class: event.target.value, section: "" }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value="">All classes</option>
                    {filterOptions.classes.map((item) => (
                      <option key={item._id} value={item._id}>{classLabel(item)}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Section
                  <select
                    value={filters.section}
                    onChange={(event) => setFilters((current) => ({ ...current, section: event.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value="">All sections</option>
                    {filterOptions.sections.map((section) => (
                      <option key={section} value={section}>Section {section}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Query
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => { setFilters({ college: "", department: "", class: "", section: "" }); setQuery(""); }}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <FaTimes className="text-xs" /> Clear
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-12 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : filteredRecords.length ? (
          <>
            <div className="divide-y divide-slate-100 sm:hidden">
              {filteredRecords.map((record) => (
                <div key={record._id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-800">
                        {displayValue(record, config.columns[0][0])}
                      </p>
                      {config.columns.slice(1).map(([field, label]) => (
                        <p key={field} className="mt-1.5 text-sm text-slate-600">
                          <span className="font-medium text-slate-500">{label}: </span>
                          <span className="break-words">{displayValue(record, field)}</span>
                        </p>
                      ))}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => openView(record)} aria-label={`View ${config.singular}`} className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100"><FaEye /></button>
                      {config.editable !== false && (
                        <button type="button" onClick={() => openEdit(record)} aria-label={`Edit ${config.singular}`} className="grid h-9 w-9 place-items-center rounded-lg text-indigo-600 transition hover:bg-indigo-50"><FaEdit /></button>
                      )}
                      <button type="button" onClick={() => deleteRecord(record)} aria-label={`Delete ${config.singular}`} className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="scroll-area hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    {config.columns.map(([, label]) => <th key={label} className="whitespace-nowrap px-6 py-3.5">{label}</th>)}
                    <th className="w-28 px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((record) => (
                    <tr key={record._id} className="transition hover:bg-slate-50/70">
                      {config.columns.map(([field], index) => (
                        <td key={field} className={`max-w-xs px-6 py-4 ${index === 0 ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                          <span className="block truncate">{displayValue(record, field)}</span>
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openView(record)} aria-label={`View ${config.singular}`} className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100"><FaEye /></button>
                          {config.editable !== false && (
                            <button type="button" onClick={() => openEdit(record)} aria-label={`Edit ${config.singular}`} className="grid h-8 w-8 place-items-center rounded-lg text-indigo-600 transition hover:bg-indigo-50"><FaEdit /></button>
                          )}
                          <button type="button" onClick={() => deleteRecord(record)} aria-label={`Delete ${config.singular}`} className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState title={query ? `matching ${config.title.toLowerCase()}` : config.title} onAdd={openCreate} />
        )}
      </section>

      {modal?.mode === "view" && (
        <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-0 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <button type="button" aria-label="Close dialog" onClick={closeModal} className="absolute inset-0" />
          <div className="scroll-area relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <h2 id="dialog-title" className="text-xl font-bold text-slate-900">{config.title} profile</h2>
              <button type="button" onClick={closeModal} aria-label="Close dialog" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><FaTimes /></button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4">
                {modal.record.profilePhoto ? (
                  <img src={modal.record.profilePhoto} alt={modal.record.name} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white">
                    {initials(displayValue(modal.record, config.columns[0][0]))}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold text-slate-900">{displayValue(modal.record, config.columns[0][0])}</p>
                  {modal.record.class && (
                    <p className="mt-1 text-sm text-slate-500">{classLabel(modal.record.class)}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {config.fields.filter((field) => !field.hideInView).map((field) => (
                  <div key={field.name} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</p>
                    <p className="mt-1 break-words text-sm font-medium text-slate-800">
                      {displayValue(modal.record, field.name)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">Close</button>
                <button
                  type="button"
                  onClick={() => deleteRecord(modal.record)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <FaTrash className="text-xs" /> Delete
                </button>
                {config.editable !== false && (
                  <button
                    type="button"
                    onClick={() => openEdit(modal.record)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
                  >
                    <FaEdit className="text-xs" /> Edit profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {modal && modal.mode !== "view" && (
        <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-0 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <button type="button" aria-label="Close dialog" onClick={closeModal} className="absolute inset-0" />
          <form onSubmit={saveRecord} className="scroll-area relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <h2 id="dialog-title" className="text-xl font-bold text-slate-900">{modal.mode === "edit" ? `Edit ${config.singular}` : `Add ${config.singular}`}</h2>
                <p className="mt-1 text-sm text-slate-500">Fields marked with an asterisk are required.</p>
              </div>
              <button type="button" onClick={closeModal} disabled={saving} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><FaTimes /></button>
            </div>
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              {config.fields.map((field) => {
                const options = field.options?.(catalog);
                const isEditPassword = field.password && modal.mode === "edit";
                const required = isEditPassword ? false : field.required;
                return (
                  <label key={field.name} className={`block text-sm font-semibold text-slate-700 ${field.name === "name" || field.name === "facultyName" || field.name === "subject" ? "sm:col-span-2" : ""}`}>
                    {field.label}{required && <span className="ml-1 text-rose-500">*</span>}
                    {options ? (
                      <select
                        required={required}
                        value={form[field.name] ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      >
                        <option value="">{field.required ? `Select ${field.label.toLowerCase()}` : `No ${field.label.toLowerCase()}`}</option>
                        {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    ) : (
                      <input
                        required={required}
                        type={field.type || "text"}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        autoComplete={field.password ? "new-password" : undefined}
                        value={form[field.name] ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                        placeholder={isEditPassword ? "Leave blank to keep current password" : field.placeholder}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    )}
                  </label>
                );
              })}
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} disabled={saving} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : modal.mode === "edit" ? "Save changes" : `Add ${config.singular}`}
              </button>
            </div>
          </form>
        </div>
      )}
      {importSpec && importOpen && (
        <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-0 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="import-dialog-title">
          <button type="button" aria-label="Close dialog" onClick={() => !importing && setImportOpen(false)} className="absolute inset-0" />
          <form onSubmit={submitImport} className="scroll-area relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <h2 id="import-dialog-title" className="text-xl font-bold text-slate-900">{importSpec.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{importSpec.description}</p>
              </div>
              <button type="button" onClick={() => !importing && setImportOpen(false)} aria-label="Close dialog" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><FaTimes /></button>
            </div>

            <div className="p-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50 disabled:opacity-60"
              >
                <FaUpload className="text-2xl text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">Click to choose a file</span>
                <span className="text-xs text-slate-400">{importSpec.fileLabel}</span>
              </button>
              <input ref={fileInputRef} type="file" accept={importSpec.accept} onChange={handleFileChange} className="hidden" />

              <div className="mt-5">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="import-textarea">
                  {importSpec.textLabel}
                </label>
                <textarea
                  id="import-textarea"
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                  disabled={importing}
                  rows={12}
                  placeholder={importSpec.placeholder}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-mono text-xs leading-5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setImportOpen(false)} disabled={importing} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">Cancel</button>
              <button type="submit" disabled={importing || !importText.trim()} className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                <FaFileImport className="text-xs" />
                {importing ? "Importing..." : importSpec.buttonLabel}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminManager;
