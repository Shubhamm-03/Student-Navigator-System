import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCheck,
  FaEdit,
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import api from "../../api/axios";
import AdminLayout from "../../components/admin/AdminLayout";

const classLabel = (item) => {
  if (!item) return "Unassigned";
  return `${item.department} · Sem ${item.semester} · Sec ${item.section}`;
};

const displayValue = (item, field) => {
  const value = item[field];
  if (field === "class") return classLabel(value);
  if (field === "subject") return value ? `${value.code} — ${value.name}` : "Unassigned";
  if (field === "faculty") return value?.facultyName || "Unassigned";
  if (field === "room") return value?.roomNo || "Unassigned";
  if (field === "department" && typeof value === "object") return value?.code || "Unassigned";
  if (field === "academicYear") return value || "—";
  return value ?? "—";
};

const resourceConfig = {
  students: {
    title: "Students",
    singular: "student",
    subtitle: "Maintain the student directory and class assignments.",
    columns: [["name", "Student"], ["rollNo", "Roll number"], ["enrollmentNo", "Enrollment no"], ["phone", "Phone"], ["class", "Class"]],
    fields: [
      { name: "name", label: "Full name", required: true },
      { name: "rollNo", label: "Roll number", required: true },
      { name: "enrollmentNo", label: "Enrollment number", placeholder: "e.g. EN231001" },
      { name: "phone", label: "Phone number", required: true, type: "tel" },
      { name: "class", label: "Class", required: true, options: (catalog) => catalog.classes.map((item) => [item._id, classLabel(item)]) },
    ],
  },
  faculty: {
    title: "Faculty",
    singular: "faculty member",
    subtitle: "Assign teaching staff to their subjects and departments.",
    columns: [["facultyName", "Faculty member"], ["designation", "Designation"], ["subject", "Subject"], ["department", "Department"]],
    fields: [
      { name: "facultyName", label: "Full name", required: true },
      { name: "designation", label: "Designation", required: true, placeholder: "e.g. Assistant Professor" },
      { name: "subject", label: "Primary subject", required: true, options: (catalog) => catalog.subjects.map((item) => [item._id, `${item.code} — ${item.name}`]) },
      { name: "department", label: "Department", required: true, options: (catalog) => catalog.departments.map((item) => [item._id, `${item.code} — ${item.name}`]) },
    ],
  },
  classes: {
    title: "Classes",
    singular: "class",
    subtitle: "Create class cohorts before assigning students and schedules.",
    columns: [["department", "Department"], ["semester", "Semester"], ["section", "Section"], ["academicYear", "Academic year"]],
    fields: [
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
    columns: [["roomNo", "Room"], ["block", "Block"], ["floor", "Floor"], ["wing", "Wing"]],
    fields: [
      { name: "roomNo", label: "Room number", required: true, placeholder: "e.g. B-204" },
      { name: "block", label: "Block", required: true, placeholder: "e.g. Academic Block B" },
      { name: "floor", label: "Floor", required: true, placeholder: "e.g. Second floor" },
      { name: "wing", label: "Wing", required: true, placeholder: "e.g. East wing" },
    ],
  },
  timetable: {
    title: "Timetable",
    singular: "schedule entry",
    subtitle: "Connect each class to the right subject, faculty member, room, and time.",
    columns: [["day", "Day"], ["startTime", "Starts"], ["endTime", "Ends"], ["class", "Class"], ["subject", "Subject"], ["room", "Room"]],
    fields: [
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
    columns: [["code", "Code"], ["name", "Department name"]],
    fields: [
      { name: "code", label: "Department code", required: true, placeholder: "e.g. CSE-AI" },
      { name: "name", label: "Department name", required: true },
    ],
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
  const [records, setRecords] = useState([]);
  const [catalog, setCatalog] = useState({ classes: [], subjects: [], departments: [], faculty: [], rooms: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!config) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setNotice(null);
      try {
        const [recordsResponse, catalogResponse] = await Promise.all([
          api.get(`/admin/${resource}`),
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
  }, [resource, config, navigate]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return records;
    return records.filter((record) => config.columns.some(([field]) => String(displayValue(record, field)).toLowerCase().includes(normalizedQuery)));
  }, [records, query, config]);

  const openCreate = () => {
    setForm(Object.fromEntries(config.fields.map((field) => [field.name, ""])));
    setModal({ mode: "create" });
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

  if (!config) return null;

  return (
    <AdminLayout
      title={config.title}
      subtitle={config.subtitle}
      action={
        <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700">
          <FaPlus className="text-xs" />
          <span className="hidden sm:inline">Add {config.singular}</span>
          <span className="sm:hidden">Add</span>
        </button>
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
          <label className="relative block w-full sm:w-72">
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

        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-12 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : filteredRecords.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
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
                        <button type="button" onClick={() => openEdit(record)} aria-label={`Edit ${config.singular}`} className="grid h-8 w-8 place-items-center rounded-lg text-indigo-600 transition hover:bg-indigo-50"><FaEdit /></button>
                        <button type="button" onClick={() => deleteRecord(record)} aria-label={`Delete ${config.singular}`} className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title={query ? `matching ${config.title.toLowerCase()}` : config.title} onAdd={openCreate} />
        )}
      </section>

      {modal && (
        <div className="fixed inset-0 z-[60] flex items-end bg-slate-950/50 p-0 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <button type="button" aria-label="Close dialog" onClick={closeModal} className="absolute inset-0" />
          <form onSubmit={saveRecord} className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
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
                return (
                  <label key={field.name} className={`block text-sm font-semibold text-slate-700 ${field.name === "name" || field.name === "facultyName" || field.name === "subject" ? "sm:col-span-2" : ""}`}>
                    {field.label}{field.required && <span className="ml-1 text-rose-500">*</span>}
                    {options ? (
                      <select
                        required={field.required}
                        value={form[field.name] ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      >
                        <option value="">{field.required ? `Select ${field.label.toLowerCase()}` : `No ${field.label.toLowerCase()}`}</option>
                        {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    ) : (
                      <input
                        required={field.required}
                        type={field.type || "text"}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={form[field.name] ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                        placeholder={field.placeholder}
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
    </AdminLayout>
  );
};

export default AdminManager;
