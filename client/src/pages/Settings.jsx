import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import {
  FaPalette,
  FaUserEdit,
  FaLock,
  FaInfoCircle,
  FaCog,
  FaPhoneAlt,
  FaCamera,
} from "react-icons/fa";

import ThemeToggle from "../components/ui/ThemeToggle";

const Settings = () => {
  return (
    <MainLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
          <FaCog className="text-slate-500" /> Settings
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

            <ThemeToggle />

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
            Update your phone number and profile photo.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            <Link
              to="/profile/edit"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 transition hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
            >
              <FaPhoneAlt className="text-indigo-600" />

              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Edit Phone
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Change your contact number
                </p>
              </div>

            </Link>

            <Link
              to="/profile/photo"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 transition hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
            >
              <FaCamera className="text-indigo-600" />

              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Update Photo
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Upload a new profile picture
                </p>
              </div>

            </Link>

          </div>

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
