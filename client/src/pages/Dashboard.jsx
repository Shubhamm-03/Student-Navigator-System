import { useEffect, useState } from "react";
import {
  FaBolt,
  FaCalendarAlt,
  FaUser,
  FaMapMarkedAlt,
  FaLocationArrow,
  FaHandPointRight,
} from "react-icons/fa";

import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";

import ProfileCard from "../components/ProfileCard";
import CurrentClassCard from "../components/CurrentClassCard";
import NextClassCard from "../components/NextClassCard";
import ClassInfoCard from "../components/ClassInfoCard";
import QuickActionCard from "../components/QuickActionCard";

import getGreeting from "../utils/getGreeting";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [currentClass, setCurrentClass] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const [todayClasses, setTodayClasses] = useState([]);

  useEffect(() => {
    let isActive = true;

    Promise.all([
        api.get("/students/profile"),
        api.get("/timetable/current"),
        api.get("/timetable/next"),
        api.get("/timetable/today"),
    ])
      .then(([profileRes, currentRes, nextRes, todayRes]) => {
        if (!isActive) return;

        setProfile(profileRes.data.student);
        setCurrentClass(currentRes.data.currentClass);
        setNextClass(nextRes.data.nextClass);
        setTodayClasses(todayRes.data.timetable);
      })
      .catch((error) => console.error(error));

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <MainLayout>

      {/* Header */}

      <section className="mb-10">

        <h1 className="flex items-center gap-3 text-4xl font-bold text-slate-900 dark:text-white">

          {getGreeting()}, {profile?.name || "Student"} <FaHandPointRight className="text-3xl text-indigo-500" />

        </h1>

        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">

          Welcome to Student Navigator System

        </p>

      </section>

      {/* Profile */}

      <section className="mb-10">

        <ProfileCard student={profile} />

      </section>

      {/* Current & Next */}

      <section className="mb-10 grid gap-6 xl:grid-cols-2">

        <CurrentClassCard currentClass={currentClass} />

        <NextClassCard nextClass={nextClass} />

      </section>

      {/* Today's Schedule */}

      <section className="mb-10 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl transition-all duration-300">

        <div className="border-b border-slate-200 dark:border-slate-700 px-8 py-6">

          <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">

            <FaCalendarAlt className="text-indigo-500" /> Today's Schedule

          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">

            Your complete schedule for today.

          </p>

        </div>

        <div className="p-8">

          {todayClasses.length === 0 ? (

            <div className="py-10 text-center">

              <div className="flex justify-center text-6xl text-slate-300 dark:text-slate-600">

                <FaCalendarAlt />

              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">

                No Classes Today

              </h3>

              <p className="mt-3 text-slate-500 dark:text-slate-400">

                Enjoy your free day.

              </p>

            </div>

          ) : (

            <div className="space-y-8">

              {todayClasses.map((item) => (

                <ClassInfoCard
                  key={item._id}
                  item={item}
                  gradient="indigo"
                />

              ))}

            </div>

          )}

        </div>

      </section>

      {/* Quick Actions */}

      <section>

        <div className="mb-6">

          <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">

            <FaBolt className="text-amber-500" /> Quick Actions

          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">

            Quickly access the most frequently used features.

          </p>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          <QuickActionCard
            title="Weekly Timetable"
            icon={<FaCalendarAlt />}
            color="bg-indigo-600"
            link="/week"
          />

          <QuickActionCard
            title="My Profile"
            icon={<FaUser />}
            color="bg-emerald-500"
            link="/profile"
          />

          <QuickActionCard
            title="Find Classroom"
            icon={<FaLocationArrow />}
            color="bg-purple-600"
            link="/find-room"
          />

          <QuickActionCard
            title="Campus Map"
            icon={<FaMapMarkedAlt />}
            color="bg-amber-500"
            link="/campus-map"
          />

        </div>

      </section>

    </MainLayout>
  );
};

export default Dashboard;
