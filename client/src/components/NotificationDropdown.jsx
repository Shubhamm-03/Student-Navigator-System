import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaRegBell,
  FaCircle,
} from "react-icons/fa";
import api from "../api/axios";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    api.get("/notifications")
      .then((res) => {
        if (isActive) {
          setNotifications(res.data.notifications || []);
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

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Bell Button */}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >

        <FaBell className="text-xl text-slate-700 dark:text-slate-300" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
            {unreadCount}
          </span>
        )}

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
              fixed
              inset-x-3
              top-20
              z-50

              mx-auto
              w-full
              max-w-sm

              rounded-3xl
              overflow-hidden

              border
              border-slate-200
              dark:border-slate-700

              bg-white/95
              dark:bg-slate-900/95

              backdrop-blur-xl

              shadow-2xl

              sm:absolute
              sm:inset-x-auto
              sm:top-full
              sm:right-0
              sm:left-auto
              sm:mt-3
              sm:mx-0
              sm:w-[min(92vw,24rem)]
            "
          >

            {/* Header */}

            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    Notifications
                  </h2>

                  <p className="text-sm text-indigo-100 mt-1">
                    Stay updated with your classes
                  </p>

                </div>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur">
                    {unreadCount} New
                  </span>
                )}

              </div>

            </div>

            {/* Notification List */}

            <div className="scroll-area max-h-[420px] overflow-y-auto">

              {notifications.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-14">

                  <FaRegBell className="text-6xl text-slate-300 dark:text-slate-600" />

                  <h3 className="mt-5 text-lg font-semibold text-slate-700 dark:text-white">
                    No Notifications
                  </h3>

                  <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 px-8">
                    You're all caught up. New updates will appear here.
                  </p>

                </div>

              ) : (

                notifications.map((item) => (

                  <motion.div
                    key={item._id}
                    whileHover={{ x: 6 }}
                    className={`flex gap-4 border-b border-slate-100 dark:border-slate-700 p-5 transition ${
                      !item.read
                        ? "bg-indigo-50 dark:bg-indigo-900/20"
                        : ""
                    }`}
                  >

                    <div className="pt-1">

                      {!item.read ? (
                        <FaCircle className="text-xs text-indigo-600" />
                      ) : (
                        <FaBell className="text-sm text-slate-300" />
                      )}

                    </div>

                    <div className="flex-1">

                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {item.message}
                      </p>

                      <p className="mt-3 text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>

                    </div>

                  </motion.div>

                ))

              )}

            </div>

            {/* Footer */}

            <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">

              <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 font-semibold text-white transition hover:opacity-90">
                View All Notifications
              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default NotificationDropdown;
