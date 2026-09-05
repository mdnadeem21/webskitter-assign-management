export default function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-3">
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}