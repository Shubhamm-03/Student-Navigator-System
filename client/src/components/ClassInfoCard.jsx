import {
  FaBookOpen,
  FaBuilding,
  FaChalkboardTeacher,
  FaClock,
  FaColumns,
  FaLayerGroup,
} from "react-icons/fa";

const ClassInfoCard = ({
  item,
  title,
  status,
  gradient = "indigo",
}) => {
  if (!item) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-6 text-slate-500 dark:text-slate-400">
          No class available.
        </p>
      </div>
    );
  }

  const gradients = {
    indigo:
      "from-indigo-600 via-blue-600 to-cyan-500",

    emerald:
      "from-emerald-500 via-green-500 to-teal-500",

    amber:
      "from-amber-500 via-orange-500 to-red-500",
  };

  const statusColors = {
    "LIVE NOW":
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",

    "UP NEXT":
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",

    COMPLETED:
      "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8">

        <div>

          <div>

  {title && (
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
      {title}
    </h2>
  )}

  <h3
    className={`flex min-w-0 items-center justify-center gap-3 text-center font-bold text-slate-900 dark:text-white ${
      title
        ? "mt-4 text-2xl sm:text-3xl"
        : "text-2xl sm:text-3xl"
    }`}
  >
    <FaBookOpen className="shrink-0 text-indigo-500" /> <span className="break-words">{item.subject?.name}</span>
  </h3>

</div>

        </div>

        <div className="flex flex-col items-start md:items-end gap-3">

          {status && (
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                statusColors[status]
              }`}
            >
              {status}
            </span>
          )}

          <div className="rounded-full bg-slate-100 dark:bg-slate-700 px-5 py-2">

            <span className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
              <FaClock className="text-sm" /> {item.startTime} - {item.endTime}
            </span>

          </div>

        </div>

      </div>

      {/* Room */}

      <div className="px-6 sm:px-8">

        <div
          className={`rounded-3xl bg-gradient-to-r ${gradients[gradient]} px-6 py-8 text-center text-white shadow-xl sm:px-10`}
        >

          <p className="uppercase tracking-[5px] text-sm opacity-90">
            Classroom
          </p>

          {item.room ? (
            <h1 className="mt-3 break-words text-4xl font-black sm:text-5xl lg:text-6xl">
              {item.room.roomNo}
            </h1>
          ) : (
            <h1 className="mt-3 break-words text-4xl font-black sm:text-5xl">
              Not Assigned
            </h1>
          )}

        </div>

      </div>

      {/* Location */}

      <div className="mt-6 flex flex-wrap justify-center gap-4 px-6 sm:mt-8 sm:px-8">

        {item.room ? (
          <>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-5 py-3">
              <FaBuilding className="text-slate-500 dark:text-slate-400" /> <span className="font-medium">{item.room.block}</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-5 py-3">
              <FaLayerGroup className="text-slate-500 dark:text-slate-400" /> <span className="font-medium">{item.room.floor}</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-5 py-3">
              <FaColumns className="text-slate-500 dark:text-slate-400" /> <span className="font-medium">{item.room.wing}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-5 py-3">
            <FaColumns className="text-slate-500 dark:text-slate-400" /> <span className="font-medium">Open area / Ground</span>
          </div>
        )}

      </div>

      {/* Faculty */}

      <div className="mt-6 border-t border-slate-200 dark:border-slate-700 p-6 text-center sm:mt-8 sm:p-8">

        <p className="text-xs uppercase tracking-[4px] text-slate-500 dark:text-slate-400">
          Faculty
        </p>

        <h3 className="mt-3 flex min-w-0 items-center justify-center gap-3 text-center text-2xl font-semibold text-slate-900 dark:text-white">
          <FaChalkboardTeacher className="shrink-0 text-indigo-500" /> <span className="break-words">{item.faculty?.facultyName}</span>
        </h3>

      </div>

    </div>
  );
};

export default ClassInfoCard;