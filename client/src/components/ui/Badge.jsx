const colors = {
  blue: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400",

  green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",

  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",

  red: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400",
};

const Badge = ({
  children,
  color = "blue",
}) => {
  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
        ${colors[color]}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;