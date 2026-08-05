import { Link } from "react-router-dom";

const QuickActionCard = ({ title, icon, color, link }) => {
  return (
    <Link
      to={link}
      className={`${color} rounded-xl shadow-md p-6 text-white hover:scale-105 transition duration-300`}
    >
      <div className="text-4xl mb-3">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>
    </Link>
  );
};

export default QuickActionCard;