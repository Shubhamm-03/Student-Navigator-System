import { FaBars } from "react-icons/fa";
import ThemeToggle from "./ui/ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">

      <div className="h-16 flex items-center justify-between gap-3 px-4 sm:px-6">

        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">

          {/* Mobile Menu */}
          <button
            onClick={toggleSidebar}
            aria-label="Open menu"
            className="lg:hidden text-2xl text-slate-700 dark:text-slate-300 shrink-0"
          >
            <FaBars />
          </button>

          <div className="min-w-0">

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
              Dashboard
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              Student Navigator System
            </p>

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">

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
