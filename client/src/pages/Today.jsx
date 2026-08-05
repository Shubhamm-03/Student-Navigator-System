import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ClassInfoCard from "../components/ClassInfoCard";
import api from "../api/axios";

const Today = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    api.get("/timetable/today")
      .then((res) => {
        if (isActive) {
          setClasses(res.data.timetable || []);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <MainLayout>

      {/* Page Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          📅 Today's Classes
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {today}
        </p>

      </div>

      {/* Summary Card */}
      {!loading && (
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div>

              <h2 className="text-3xl font-bold">
                Today's Schedule
              </h2>

              <p className="mt-2 text-indigo-100">
                {classes.length} {classes.length === 1 ? "Class" : "Classes"} Scheduled
              </p>

            </div>

            <div className="text-6xl">
              📚
            </div>

          </div>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-12 shadow-lg text-center">

          <div className="animate-pulse text-6xl mb-5">
            ⏳
          </div>

          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
            Loading Today's Classes...
          </h2>

        </div>
      )}

      {/* Empty State */}
      {!loading && classes.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-14 shadow-lg text-center">

          <div className="text-7xl">
            🎉
          </div>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
            No Classes Today
          </h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Enjoy your free day.
          </p>

        </div>
      )}

      {/* Schedule */}
      {!loading && classes.length > 0 && (

        <div className="space-y-8">

          {classes.map((item) => (

            <ClassInfoCard
    key={item._id}
    item={item}
    gradient="indigo"
/>

          ))}

        </div>

      )}

    </MainLayout>
  );
};

export default Today;
