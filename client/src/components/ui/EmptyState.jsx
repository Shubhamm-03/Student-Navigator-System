const EmptyState = ({
  emoji,
  title,
  subtitle,
}) => {
  return (
    <div className="text-center py-10">

      <div className="text-6xl mb-4">
        {emoji}
      </div>

      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>

      <p className="text-slate-500 mt-2 dark:text-slate-400">
        {subtitle}
      </p>

    </div>
  );
};

export default EmptyState;