const DashboardCard = ({
  title,
  icon,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition dark:bg-slate-900 dark:border dark:border-slate-800 dark:hover:shadow-black/40">

      <div className="flex items-center gap-3 mb-4">

        <div className="text-3xl text-blue-600 dark:text-blue-400">
          {icon}
        </div>

        <h2 className="text-xl font-bold dark:text-slate-100">
          {title}
        </h2>

      </div>

      {children}

    </div>
  );
};

export default DashboardCard;