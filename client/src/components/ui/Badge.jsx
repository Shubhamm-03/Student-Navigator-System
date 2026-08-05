const colors = {
  blue: "bg-indigo-100 text-indigo-700",

  green: "bg-emerald-100 text-emerald-700",

  amber: "bg-amber-100 text-amber-700",

  red: "bg-red-100 text-red-700",
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