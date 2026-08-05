import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarDay,
  FaCalendarAlt,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaCog } from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
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

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
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
          h-screen
          w-72
          bg-slate-900
          text-white
          flex
          flex-col
          shadow-xl
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-slate-800">

          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
            SNS
          </div>

          <div className="ml-3">
            <h1 className="font-bold text-lg">
              Student Navigator System
            </h1>

            <p className="text-xs text-slate-400">
              Smart Campus
            </p>
          </div>

        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">

          <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">
            Navigation
          </p>

          <nav className="space-y-2">

            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300
                  ${
                    location.pathname === item.path
                      ? "bg-indigo-600"
                      : "hover:bg-slate-800"
                  }`}
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            ))}

          </nav>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10 transition"
          >
            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;