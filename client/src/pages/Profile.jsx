import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import api from "../api/axios";
import ActionCard from "../components/ActionCard";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaIdBadge,
  FaUser,
  FaCircle,
  FaPencilAlt,
  FaGlobe,
  FaAward,
  FaClipboardCheck,
  FaLock,
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
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
          <Loader />
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
        <h1 className="flex items-center gap-3 text-4xl font-bold text-slate-900 dark:text-white">
          <FaUser className="text-indigo-500" /> Student Profile
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

                <p className="mt-3 sm:mt-10 mx-auto sm:mx-0 block w-fit rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-sm font-semibold tracking-wide text-indigo-700 dark:text-indigo-300">
                  University Roll No: {student.rollNo}
                </p>

                <p className="mt-2 mx-auto sm:mx-0 block w-fit rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-sm font-semibold tracking-wide text-indigo-700 dark:text-indigo-300">
                  Enrollment No: {student.enrollmentNo || "—"}
                </p>

              </div>

            </div>

            {/* Status */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/30 px-5 py-3 font-semibold text-green-700 dark:text-green-300">
                <FaCircle className="text-xs" /> Active Student
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
          editTo="/profile/edit"
        />

        <InfoCard
          icon={<FaEnvelope />}
          title="Email"
          value={student.email || "Not Available"}
          editTo={student.email ? undefined : "/profile/email"}
          actionLabel="Setup"
          locked={Boolean(student.email)}
        />

        <InfoCard
          icon={<FaGraduationCap />}
          title="Semester"
          value={student.class?.semester}
          editTo="/profile/edit/class"
        />

        <InfoCard
          icon={<FaUniversity />}
          title="Department"
          value={student.class?.department}
          editTo="/profile/edit/class"
        />

        <InfoCard
          icon={<FaIdBadge />}
          title="Section"
          value={student.class?.section}
          editTo="/profile/edit/class"
        />

        <InfoCard
          icon={<FaCalendarAlt />}
          title="Academic Year"
          value={student.class?.academicYear}
          editTo="/profile/edit/class"
        />

      </div>

      {/* Official Links */}

<div className="mt-12">

  <div className="mb-8">

    <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
      <FaGlobe className="text-cyan-500" /> Official Links
    </h2>

    <p className="mt-2 text-slate-500 dark:text-slate-400">
      Direct access to the university's official websites.
    </p>

  </div>

  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

    <ActionCard
      icon={<FaUniversity />}
      title="Official Website"
      description="Visit the BBD University official website."
      color="blue"
      href="https://www.bbdu.ac.in/"
    />

    <ActionCard
      icon={<FaAward />}
      title="BBD Results"
      description="Check your results on the official results portal."
      color="green"
      href="https://www.bbdu.ac.in/result"
    />

    <ActionCard
      icon={<FaClipboardCheck />}
      title="Exam Form Submission"
      description="Submit your exam forms online."
      color="amber"
      href="https://examcell.bbdu.ac.in/bbduexamcell/"
    />

  </div>

</div>

    </MainLayout>
  );
};

const InfoCard = ({ icon, title, value, editTo, actionLabel = "Edit", locked }) => {
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

      {editTo && (
        <Link
          to={editTo}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-4 py-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 transition hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
        >
          <FaPencilAlt className="text-xs" /> {actionLabel}
        </Link>
      )}

      {locked && (
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-4 py-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
          <FaLock className="text-xs" /> Cannot be changed
        </span>
      )}

    </div>
  );
};

export default Profile;
