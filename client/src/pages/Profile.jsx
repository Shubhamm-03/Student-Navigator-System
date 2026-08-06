import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import ActionCard from "../components/ActionCard";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaIdBadge,
  FaCog,
  FaLock,
  FaCamera,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Profile = () => {
  const [student, setStudent] = useState(null);

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

  if (!student) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-xl text-slate-500 dark:text-slate-400">
            Loading Profile...
          </p>
        </div>
      </MainLayout>
    );
  }

  const initials = student.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          👤 Student Profile
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          View your personal and academic information.
        </p>
      </div>

      {/* Hero Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">

        {/* Top Gradient */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500"></div>

        {/* Profile Content */}
        <div className="-mt-16 px-8 pb-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar */}
              <div className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-800 bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl overflow-hidden">

                {student.profilePhoto ? (
                  <img
                    src={student.profilePhoto}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}

              </div>

              {/* Name */}
              <div className="text-center sm:text-left mt-2">

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {student.name}
                </h2>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Roll No: {student.rollNo}
                </p>

                <p className="text-slate-500 dark:text-slate-400">
                  {student.class?.department}
                </p>

              </div>

            </div>

            {/* Status */}
            <div>
              <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-5 py-3 font-semibold text-green-700 dark:text-green-300">
                🟢 Active Student
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Information Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <InfoCard
          icon={<FaPhoneAlt />}
          title="Phone"
          value={student.phone || "Not Available"}
        />

        <InfoCard
          icon={<FaEnvelope />}
          title="Email"
          value={student.email || "Not Available"}
        />

        <InfoCard
          icon={<FaGraduationCap />}
          title="Semester"
          value={student.class?.semester}
        />

        <InfoCard
          icon={<FaUniversity />}
          title="Department"
          value={student.class?.department}
        />

        <InfoCard
          icon={<FaIdBadge />}
          title="Section"
          value={student.class?.section}
        />

        <InfoCard
          icon={<FaCalendarAlt />}
          title="Academic Year"
          value={student.class?.academicYear}
        />

      </div>

      {/* Quick Actions */}

<div className="mt-12">

  <div className="mb-8">

    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
      ⚡ Quick Actions
    </h2>

    <p className="mt-2 text-slate-500 dark:text-slate-400">
      Quickly access the most frequently used features.
    </p>

  </div>

  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

    <ActionCard
      icon={<FaPhoneAlt />}
      title="Edit Phone"
      description="Update your contact number."
      color="indigo"
      to="/profile/edit"
    />

    <ActionCard
      icon={<FaLock />}
      title="Change Password"
      description="Keep your account secure."
      color="red"
      to="/change-password"
    />

    <ActionCard
      icon={<FaCamera />}
      title="Update Photo"
      description="Upload a new profile picture."
      color="green"
      to="/profile/photo"
    />

    <ActionCard
      icon={<FaCog />}
      title="Settings"
      description="Manage application settings."
      color="amber"
      to="/settings"
    />

    <ActionCard
      icon={<FaCalendarAlt />}
      title="Today's Classes"
      description="View today's class schedule."
      color="blue"
      to="/today"
    />

    <ActionCard
      icon={<FaMapMarkerAlt />}
      title="Find Classroom"
      description="Locate your classroom quickly."
      color="purple"
      to="/find-room"
    />

  </div>

</div>

    </MainLayout>
  );
};

const InfoCard = ({ icon, title, value }) => {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

      <div className="text-2xl text-indigo-600">
        {icon}
      </div>

      <p className="mt-4 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white break-words">
        {value || "-"}
      </h3>

    </div>
  );
};

export default Profile;
