export default function Rating({
  value,
  max = 5,
}: {
  value: number;
  max?: number;
}) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    stars.push(
      <span key={i} className={i <= value ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}>
        {i <= value ? "★" : "☆"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-sm" title={`${value}/${max}`}>
      {stars}
      <span className="ml-1 text-xs text-gray-400">{value}</span>
    </span>
  );
}
