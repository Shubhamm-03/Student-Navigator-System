const variants = {
  primary:
    "bg-indigo-600 hover:bg-indigo-700 text-white",

  success:
    "bg-emerald-500 hover:bg-emerald-600 text-white",

  warning:
    "bg-amber-500 hover:bg-amber-600 text-white",

  danger:
    "bg-red-500 hover:bg-red-600 text-white",

  outline:
    "border border-slate-300 hover:bg-slate-100 text-slate-700",
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`
        px-5
        py-3
        rounded-xl
        font-medium
        transition-all
        duration-300
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;