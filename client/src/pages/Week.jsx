import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import ClassInfoCard from "../components/ClassInfoCard";
import api from "../api/axios";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getTodayName = () => new Date().toLocaleDateString("en-US", {
  weekday: "long",
});

const Week = () => {
  const [week, setWeek] = useState({});
  const [selectedDay, setSelectedDay] = useState(() => {
    const currentDay = getTodayName();
    return days.includes(currentDay) ? currentDay : "Monday";
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    api.get("/timetable/week")
      .then((res) => {
        if (isActive) {
          setWeek(res.data.week || {});
        }
      })
      .catch((err) => console.error("Failed to load timetable:", err))
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const today = getTodayName();

  return (
    <MainLayout>
      {/* Header */}

      <div className="mb-10">
        <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          <FaCalendarAlt className="text-indigo-500" /> Weekly Timetable
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          View your complete weekly class schedule.
        </p>
      </div>

      {/* Day Buttons */}

      <div className="mb-10 flex flex-wrap gap-3">
        {days.map((day) => {
          const active = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`rounded-2xl px-6 py-3 font-semibold transition-all duration-300
                ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
                }`}
            >
              {day}

              {day === today && (
                <span className="ml-2 rounded-full bg-emerald-500 px-2 py-1 text-xs text-white">
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day */}

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {selectedDay}
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {week[selectedDay]?.length || 0} Classes Scheduled
          </p>
        </div>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-4">

          <Loader />

          <p className="text-lg text-slate-500">
            Loading weekly timetable...
          </p>

        </div>
      ) : (
        <div className="space-y-8">
          {week[selectedDay]?.length > 0 ? (
            week[selectedDay].map((item) => (
              <ClassInfoCard
                key={item._id}
                item={item}
                gradient="indigo"
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-12 text-center shadow-lg">
              <div className="flex justify-center text-6xl text-slate-300 dark:text-slate-600"><FaCalendarAlt /></div>

              <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
                No Classes Scheduled
              </h2>

              <p className="mt-3 text-slate-500 dark:text-slate-400">
                There are no classes scheduled for{" "}
                <strong>{selectedDay}</strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default Week;
