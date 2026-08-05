import { FaUserGraduate } from "react-icons/fa";

const ProfileCard = ({ student }) => {
  if (!student) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md transition-all duration-300 p-6">

      <div className="flex items-center gap-4">

        <FaUserGraduate className="text-5xl text-blue-600 dark:text-blue-400" />

        <div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {student.name}
          </h2>

          <p className="text-slate-600 dark:text-slate-300">
            📱 {student.phone}
          </p>

          <p className="text-slate-600 dark:text-slate-300">
            🆔 {student.rollNo}
          </p>

        </div>

      </div>

    </div>
  );
};

export default ProfileCard;