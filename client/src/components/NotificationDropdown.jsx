import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBell,
  FaRegBell,
  FaCircle,
  FaCheckDouble,
  FaBookOpen,
} from "react-icons/fa";
import api from "../api/axios";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [markingAll, setMarkingAll] = useState(false);

  const dropdownRef = useRef(null);
  const seenIds = useRef(new Set());
  const navigate = useNavigate();

  const fetchNotifications = () => {
    api.get("/notifications")
      .then((res) => {
        const list = res.data.notifications || [];
        setNotifications(list);

        const fresh = list.filter((n) => !seenIds.current.has(n._id));

        if (fresh.length > 0) {
          fresh.forEach((n) => seenIds.current.add(n._id));
          const latest = fresh[0];
          toast(
            (t) => (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-indigo-500"><FaBookOpen /></span>
                <div>
                  <p className="font-semibold text-slate-900">{latest.title}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{latest.message}</p>
                </div>
              </div>
            ),
            { duration: 8000 }
          );
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    seenIds.current.clear();
    fetchNotifications();

    const timer = setInterval(fetchNotifications, 60 * 1000);

    return () => clearInterval(timer);
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

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.put("/notifications/read-all");
      setNotifications((current) =>
        current.map((n) => ({ ...n, read: true }))
      );
      toast.success("All notifications marked as read.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update notifications.");
    } finally {
      setMarkingAll(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((current) =>
        current.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const openAll = () => {
    setOpen(false);
    navigate("/notifications");
  };

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

                  <motion.button
                    key={item._id}
                    type="button"
                    onClick={() => markRead(item._id)}
                    whileHover={{ x: 6 }}
                    className={`flex w-full gap-4 border-b border-slate-100 dark:border-slate-700 p-5 text-left transition ${
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

                    <div className="flex-1 min-w-0">

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

                  </motion.button>

                ))

              )}

            </div>

            {/* Footer */}

            <div className="flex flex-col gap-2 border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={markingAll}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaCheckDouble /> {markingAll ? "Marking..." : "Mark all as read"}
                </button>
              )}

              <button
                type="button"
                onClick={openAll}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 font-semibold text-white transition hover:opacity-90"
              >
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
