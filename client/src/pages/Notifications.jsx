import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBell,
  FaRegBell,
  FaCircle,
  FaCheckDouble,
  FaBookOpen,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import api from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = () => {
    api.get("/notifications")
      .then((res) => {
        setNotifications(res.data.notifications || []);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.put("/notifications/read-all");
      setNotifications((current) => current.map((n) => ({ ...n, read: true })));
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
      toast.error(err.response?.data?.message || "Unable to update notification.");
    }
  };

  return (
    <MainLayout>

      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            <FaBell className="text-indigo-500" /> Notifications
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Class reminders and important updates.
          </p>

        </div>

        {!loading && unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            disabled={markingAll}
            className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaCheckDouble /> {markingAll ? "Marking..." : "Mark all as read"}
          </button>
        )}

      </div>

      {loading && (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <Loader />
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
            Loading Notifications...
          </h2>
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-14 shadow-lg text-center">

          <div className="flex justify-center text-7xl text-slate-300 dark:text-slate-600">
            <FaRegBell />
          </div>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
            No Notifications
          </h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            You're all caught up. Reminders about your next class will appear here.
          </p>

        </div>
      )}

      {!loading && notifications.length > 0 && (

        <div className="space-y-4">

          {notifications.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => markRead(item._id)}
              className={`w-full rounded-3xl border p-6 text-left shadow-lg transition ${
                !item.read
                  ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >
              <div className="flex items-start gap-4">

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200">
                  <FaBookOpen />
                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    {!item.read && (
                      <span className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                        <FaCircle className="text-[6px]" /> New
                      </span>
                    )}

                  </div>

                  <p className="mt-1.5 break-words text-slate-600 dark:text-slate-300">
                    {item.message}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>

                </div>

              </div>
            </button>
          ))}

        </div>

      )}

    </MainLayout>
  );
};

export default Notifications;
