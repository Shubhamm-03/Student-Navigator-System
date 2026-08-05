import MainLayout from "../layouts/MainLayout";
import {
  FaPalette,
  FaMoon,
  FaSun,
  FaUserEdit,
  FaLock,
  FaInfoCircle,
} from "react-icons/fa";

import { useTheme } from "../context/useTheme";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <MainLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          ⚙️ Settings
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="space-y-6">

        {/* Appearance */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

          <div className="flex items-center justify-between">

            <div>

              <div className="flex items-center gap-3 mb-2">

                <FaPalette className="text-indigo-600 text-xl" />

                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Appearance
                </h2>

              </div>

              <p className="text-slate-500 dark:text-slate-400">
                Switch between Light and Dark mode.
              </p>

            </div>

            <button
              onClick={toggleTheme}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-indigo-600"
                  : "bg-slate-300"
              }`}
            >

              <div
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${
                  theme === "dark"
                    ? "translate-x-8"
                    : ""
                }`}
              >

                {theme === "dark" ? (
                  <FaMoon className="text-slate-700 text-xs" />
                ) : (
                  <FaSun className="text-yellow-500 text-xs" />
                )}

              </div>

            </button>

          </div>

        </div>

        {/* Profile */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

          <div className="flex items-center gap-3 mb-5">

            <FaUserEdit className="text-emerald-600 text-xl" />

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Profile
            </h2>

          </div>

          <p className="text-slate-500 dark:text-slate-400">
            Update your phone number and email.
          </p>

        </div>

        {/* Security */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

          <div className="flex items-center gap-3 mb-5">

            <FaLock className="text-red-500 text-xl" />

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Security
            </h2>

          </div>

          <p className="text-slate-500 dark:text-slate-400">
            Password settings will be available in a future update.
          </p>

        </div>

        {/* About */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-6">

          <div className="flex items-center gap-3 mb-5">

            <FaInfoCircle className="text-amber-500 text-xl" />

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              About
            </h2>

          </div>

          <div className="space-y-2 text-slate-700 dark:text-slate-300">

            <p>
              <strong>Application:</strong> Student Navigator System
            </p>

            <p>
              <strong>Version:</strong> 1.0.0
            </p>

          </div>

        </div>

      </div>

    </MainLayout>
  );
};

export default Settings;
