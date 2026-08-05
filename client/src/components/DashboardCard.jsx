const DashboardCard = ({
  title,
  icon,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">

      <div className="flex items-center gap-3 mb-4">

        <div className="text-3xl text-blue-600">
          {icon}
        </div>

        <h2 className="text-xl font-bold">
          {title}
        </h2>

      </div>

      {children}

    </div>
  );
};

export default DashboardCard;