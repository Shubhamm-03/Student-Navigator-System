import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaLayerGroup,
  FaPlus,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";
import api from "../../api/axios";
import AdminLayout from "../../components/admin/AdminLayout";

const formatClass = (classInfo) => {
  if (!classInfo) return "No class assigned";
  return `${classInfo.department} · Sem ${classInfo.semester} · Sec ${classInfo.section}`;
};

const StatCard = ({ label, value, icon: Icon, tone, href }) => (
  <Link
    to={href}
    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value ?? "—"}</p>
      </div>
      <div className={`grid h-11 w-11 place-items-center rounded-xl text-lg ${tone}`}>
        <Icon />
      </div>
    </div>
    <p className="mt-5 flex items-center gap-1 text-xs font-semibold text-slate-400 transition group-hover:text-indigo-600">
      View records <FaArrowRight className="text-[10px]" />
    </p>
  </Link>
);

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get("/admin/dashboard");
        setDashboard(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your dashboard.");
      }
    };

    loadDashboard();
  }, []);

  const stats = dashboard?.stats;
  const displayName = localStorage.getItem("adminName") || "Administrator";

  return (
    <AdminLayout
      title="Overview"
      subtitle="A snapshot of your campus directory and class schedule."
      action={
        <Link
          to="/admin/students"
          className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 sm:flex"
        >
          <FaPlus className="text-xs" /> Add student
        </Link>
      }
    >
      <section className="mb-7 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-6 py-7 text-white shadow-xl shadow-indigo-200 sm:px-8 sm:py-9">
        <p className="text-sm font-medium text-indigo-200">ADMIN WORKSPACE</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Good to see you, {displayName}.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
          Keep information accurate and students will always have the right classroom, faculty details, and schedule at hand.
        </p>
      </section>

      {error && (
        <div role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5">
        <StatCard label="Students" value={stats?.students} icon={FaUserGraduate} tone="bg-blue-50 text-blue-600" href="/admin/students" />
        <StatCard label="Faculty" value={stats?.faculty} icon={FaChalkboardTeacher} tone="bg-violet-50 text-violet-600" href="/admin/faculty" />
        <StatCard label="Classes" value={stats?.classes} icon={FaUsers} tone="bg-emerald-50 text-emerald-600" href="/admin/classes" />
        <StatCard label="Rooms" value={stats?.rooms} icon={FaDoorOpen} tone="bg-amber-50 text-amber-600" href="/admin/rooms" />
        <StatCard label="Schedule slots" value={stats?.timetable} icon={FaCalendarAlt} tone="bg-rose-50 text-rose-600" href="/admin/timetable" />
      </section>

      <section className="mt-7 grid gap-7 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h3 className="font-bold text-slate-900">Recently added students</h3>
              <p className="mt-1 text-sm text-slate-500">The newest members of your student directory.</p>
            </div>
            <Link to="/admin/students" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {dashboard?.recentStudents?.length ? (
              dashboard.recentStudents.map((student) => (
                <div key={student._id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                    {student.name?.slice(0, 1)?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{student.name}</p>
                    <p className="truncate text-xs text-slate-500">{student.rollNo} · {formatClass(student.class)}</p>
                  </div>
                  <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 sm:block">Student</span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-sm text-slate-500">No students have been added yet.</div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h3 className="font-bold text-slate-900">Schedule at a glance</h3>
              <p className="mt-1 text-sm text-slate-500">Configured timetable entries.</p>
            </div>
            <Link to="/admin/timetable" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Manage</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {dashboard?.upcomingSchedule?.length ? (
              dashboard.upcomingSchedule.map((entry) => (
                <div key={entry._id} className="flex gap-4 px-5 py-4 sm:px-6">
                  <div className="min-w-16 pt-0.5 text-xs font-bold text-indigo-600">
                    <p>{entry.day?.slice(0, 3)?.toUpperCase()}</p>
                    <p className="mt-1 whitespace-nowrap text-slate-400">{entry.startTime}</p>
                  </div>
                  <div className="min-w-0 border-l border-slate-100 pl-4">
                    <p className="truncate text-sm font-semibold text-slate-800">{entry.subject?.name || "Unassigned subject"}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {formatClass(entry.class)} · {entry.room?.roomNo || "Room unassigned"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-sm text-slate-500">No timetable entries have been configured.</div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><FaLayerGroup /></div>
          <div>
            <h3 className="font-bold text-slate-900">Quick setup</h3>
            <p className="text-sm text-slate-500">Add the building blocks for a complete student experience.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Set up departments", "Create the academic department list.", "/admin/departments"],
            ["Add subjects", "Build the subject catalogue.", "/admin/subjects"],
            ["Add classrooms", "Record room location details.", "/admin/rooms"],
            ["Build the timetable", "Connect classes, faculty, rooms, and subjects.", "/admin/timetable"],
          ].map(([heading, detail, href]) => (
            <Link key={href} to={href} className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40">
              <p className="font-semibold text-slate-800">{heading}</p>
              <p className="mt-1 text-sm leading-5 text-slate-500">{detail}</p>
            </Link>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;
