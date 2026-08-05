import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBook,
  FaBuilding,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaChevronRight,
  FaDoorOpen,
  FaHome,
  FaSignOutAlt,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";

const navigation = [
  { label: "Overview", path: "/admin/dashboard", icon: FaHome },
  { label: "Students", path: "/admin/students", icon: FaUserGraduate },
  { label: "Faculty", path: "/admin/faculty", icon: FaChalkboardTeacher },
  { label: "Classes", path: "/admin/classes", icon: FaUsers },
  { label: "Rooms", path: "/admin/rooms", icon: FaDoorOpen },
  { label: "Timetable", path: "/admin/timetable", icon: FaCalendarAlt },
];

const academicNavigation = [
  { label: "Subjects", path: "/admin/subjects", icon: FaBook },
  { label: "Departments", path: "/admin/departments", icon: FaBuilding },
];

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const NavItem = ({ item, onNavigate }) => {
  const location = useLocation();
  const Icon = item.icon;
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
        isActive
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon className="text-base" />
      <span>{item.label}</span>
      {isActive && <FaChevronRight className="ml-auto text-xs text-indigo-200" />}
    </Link>
  );
};

const AdminLayout = ({ children, title, subtitle, action }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const adminName = localStorage.getItem("adminName") || "Administrator";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  const closeNav = () => setOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeNav}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-slate-950 px-4 py-5 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link to="/admin/dashboard" onClick={closeNav} className="mb-9 flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black tracking-tight text-white shadow-lg shadow-indigo-950/50">
            SNS
          </div>
          <div>
            <p className="font-bold tracking-tight text-white">Student Navigator</p>
            <p className="text-xs text-slate-500">ADMIN CONSOLE</p>
          </div>
        </Link>

        <nav className="space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.16em] text-slate-500">WORKSPACE</p>
          {navigation.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={closeNav} />
          ))}
        </nav>

        <nav className="mt-7 space-y-1 border-t border-slate-800 pt-6">
          <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.16em] text-slate-500">ACADEMIC SETUP</p>
          {academicNavigation.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={closeNav} />
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-900 px-3 py-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
              {initials(adminName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{adminName}</p>
              <p className="text-xs text-slate-500">System administrator</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:ml-[272px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
              >
                <FaBars />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
                {subtitle && <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">{subtitle}</p>}
              </div>
            </div>
            {action}
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1600px] p-5 sm:p-7 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
