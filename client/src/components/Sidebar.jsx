import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarDay,
  FaCalendarAlt,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaCog,
  FaTimes,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  toggleCollapsed,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Today's Classes",
      path: "/today",
      icon: <FaCalendarDay />,
    },
    {
      name: "Weekly Timetable",
      path: "/week",
      icon: <FaCalendarAlt />,
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: <FaUserGraduate />,
    },
    {
      name: "Find Classroom",
      path: "/find-room",
      icon: <FaMapMarkerAlt />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [sidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-dvh
          bg-slate-900
          dark:bg-white
          text-white
          dark:text-slate-900
          flex
          flex-col
          shadow-xl
          transition-all
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
          ${collapsed ? "lg:w-20" : "lg:w-72"}
          w-72
        `}
      >
        {/* Logo */}
        <div
          className={`h-20 shrink-0 flex items-center border-b border-slate-800 dark:border-slate-200 relative ${
            collapsed ? "lg:justify-center" : "lg:justify-start"
          } justify-center`}
        >

          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold shrink-0">
            SNS
          </div>

          <div className={`ml-3 pr-10 sm:pr-0 lg:pr-12 ${collapsed ? "lg:hidden" : ""}`}>
            <h1 className="font-bold text-lg leading-tight">
              Student Navigator System
            </h1>

            <p className="text-xs text-slate-400 dark:text-slate-500">
              Smart Campus
            </p>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-700 transition"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-slate-800 dark:bg-slate-100 border border-slate-700 dark:border-slate-200 text-slate-400 dark:text-slate-500 hover:text-indigo-400 dark:hover:text-indigo-600 transition shadow"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>

        </div>

        {/* Navigation */}
        <div className="scroll-area flex-1 overflow-y-auto px-3 py-6">

          <p
            className={`text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            Navigation
          </p>

          <nav className="space-y-2">

            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300
                    ${collapsed ? "lg:justify-center lg:px-0" : ""}
                    ${
                      isActive
                        ? "bg-indigo-600/20 text-indigo-300 dark:bg-indigo-50 dark:text-indigo-700"
                        : "text-slate-400 dark:text-slate-600 hover:bg-slate-800 dark:hover:bg-slate-100 hover:text-white dark:hover:text-slate-900"
                    }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-indigo-600 transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    } ${collapsed ? "lg:opacity-0" : ""}`}
                  />

                  <span className="text-lg shrink-0">
                    {item.icon}
                  </span>

                  <span className={collapsed ? "lg:hidden" : ""}>
                    {item.name}
                  </span>
                </Link>
              );
            })}

          </nav>

        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-800 dark:border-slate-200 p-4">

          <button
            onClick={handleLogout}
            title="Logout"
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 dark:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-50 transition ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <span className="text-lg shrink-0">
              <FaSignOutAlt />
            </span>

            <span className={collapsed ? "lg:hidden" : ""}>
              Logout
            </span>

          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;
