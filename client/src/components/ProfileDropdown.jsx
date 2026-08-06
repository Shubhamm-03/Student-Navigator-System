import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaCamera,
} from "react-icons/fa";

import api from "../api/axios";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState(null);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    api.get("/students/profile")
      .then((res) => {
        if (isActive) {
          setStudent(res.data.student);
        }
      })
      .catch((err) => console.log(err));

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const initials = (name) => {
    if (!name) return "S";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Button */}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl px-2 sm:px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >

        {student?.profilePhoto ? (
          <img
            src={student.profilePhoto}
            alt="Profile"
            className="h-11 w-11 rounded-full border-2 border-indigo-500 object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold shadow-lg">
            {initials(student?.name)}
          </div>
        )}

        <div className="hidden lg:block text-left">

          <h3 className="font-semibold text-slate-900 dark:text-white">
            {student?.name || "Student"}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {student?.rollNo}
          </p>

        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="hidden lg:block"
        >
          <FaChevronDown className="text-slate-500" />
        </motion.div>

      </motion.button>

      {/* Dropdown */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              opacity: 0,
              y: -12,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -12,
              scale: 0.96,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className="
              absolute
              top-full
              right-2
              sm:right-0
              mt-3
              z-50

              w-[min(92vw,24rem)]

              rounded-3xl
              overflow-hidden

              border
              border-slate-200
              dark:border-slate-700

              bg-white/95
              dark:bg-slate-900/95

              backdrop-blur-xl

              shadow-2xl
            "
          >

            {/* Header */}

            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white">

              <div className="flex flex-col sm:flex-row items-center gap-4">

                <Link
                  to="/profile/photo"
                  onClick={() => setOpen(false)}
                  title="Change photo"
                  className="relative block shrink-0 group/avatar"
                >
                  {student?.profilePhoto ? (
                    <img
                      src={student.profilePhoto}
                      alt="Profile"
                      className="h-16 w-16 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold text-indigo-600 shadow-lg">
                      {initials(student?.name)}
                    </div>
                  )}

                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-700 text-white shadow-lg transition group-hover/avatar:bg-indigo-500">
                    <FaCamera className="text-xs" />
                  </span>
                </Link>

                <div className="text-center sm:text-left">

                  <h2 className="text-lg font-bold">
                    {student?.name}
                  </h2>

                  <p className="text-sm text-indigo-100">
                    {student?.rollNo}
                  </p>

                  <p className="text-xs text-indigo-200 mt-1 break-all">
                    {student?.email}
                  </p>

                </div>

              </div>

            </div>

            {/* Menu */}

            <div className="py-2">

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-6 py-4 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:pl-8"
              >
                <FaUser />
                My Profile
              </Link>

              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 px-6 py-4 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:pl-8"
              >
                <FaCog />
                Settings
              </Link>

              <div className="mx-4 border-t border-slate-200 dark:border-slate-700"></div>

              <button
                onClick={logout}
                className="flex w-full items-center gap-4 px-6 py-4 text-red-500 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:pl-8"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default ProfileDropdown;
