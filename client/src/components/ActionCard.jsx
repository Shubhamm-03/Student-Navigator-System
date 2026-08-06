import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const colors = {
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    icon: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-700",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    icon: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-700",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-700",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-700",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    icon: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-700",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-700",
  },
};

const ActionCard = ({
  icon,
  title,
  description,
  color = "indigo",
  to,
  href,
}) => {
  const style = colors[color];

  const inner = (
    <>
      <div className={`p-6 ${style.bg}`}>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow ${style.icon} text-2xl`}
        >
          {icon}
        </div>

        <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end">

          <FaArrowRight className="text-slate-400 group-hover:translate-x-2 transition-transform duration-300" />

        </div>

      </div>
    </>
  );

  const wrapperClassName = `group block rounded-3xl border ${style.border} bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={wrapperClassName}
        >
          {inner}
        </a>
      ) : (
        <Link to={to} className={wrapperClassName}>
          {inner}
        </Link>
      )}
    </motion.div>
  );
};

export default ActionCard;