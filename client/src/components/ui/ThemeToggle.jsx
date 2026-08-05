import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-slate-300 dark:bg-slate-700 transition-all duration-300"
    >
      <div
        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300
        ${
          theme === "dark"
            ? "translate-x-8"
            : "translate-x-1"
        }`}
      >
        {theme === "dark" ? (
          <FaMoon className="text-slate-700 text-xs" />
        ) : (
          <FaSun className="text-yellow-500 text-xs" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
