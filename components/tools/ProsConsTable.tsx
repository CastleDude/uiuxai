export default function ProsConsTable({
  pros,
  cons,
  prosLabel,
  consLabel,
}: {
  pros: string[];
  cons: string[];
  prosLabel: string;
  consLabel: string;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
          {prosLabel}
        </h3>
        <ul className="space-y-1">
          {pros.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
              <span className="text-green-500 mt-0.5">✓</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
          {consLabel}
        </h3>
        <ul className="space-y-1">
          {cons.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
              <span className="text-red-500 mt-0.5">✗</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
