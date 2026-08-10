import { AnimatePresence, motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative h-10 w-10 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300 shadow-lg border ${
        isDark
          ? "bg-slate-800 text-slate-100 border-slate-700 shadow-slate-900/50"
          : "bg-slate-100 text-slate-900 border-slate-300/80 shadow-slate-200"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -120, opacity: 0, scale: 0.4 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 120, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <FaMoon className="text-lg" />
          ) : (
            <FaSun className="text-lg" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
