import { FaBars } from "react-icons/fa";
import ThemeToggle from "./ui/ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">

      <div className="h-16 flex items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-2xl text-slate-700 dark:text-slate-300"
          >
            <FaBars />
          </button>

          <div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Student Navigator System
            </p>

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-6">

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile Dropdown */}
          <ProfileDropdown />

        </div>

      </div>

    </header>
  );
};

export default Navbar;
