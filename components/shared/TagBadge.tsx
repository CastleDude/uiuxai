const variants: Record<string, string> = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  free: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  paid: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  featured: "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300",
  new: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

export type TagVariant = keyof typeof variants;

export default function TagBadge({
  label,
  variant = "default",
}: {
  label: string;
  variant?: TagVariant;
}) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
