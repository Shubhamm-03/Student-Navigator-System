const SectionTitle = ({ icon, title }) => {
  return (
    <div className="mb-6">

      <h2 className="flex items-center gap-3 text-2xl font-semibold text-slate-800 dark:text-slate-100">

        <span className="text-3xl">
          {icon}
        </span>

        {title}

      </h2>

    </div>
  );
};

export default SectionTitle;