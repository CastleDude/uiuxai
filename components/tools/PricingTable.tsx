import type { Pricing } from "@/lib/types";

export default function PricingTable({
  pricing,
  labels,
}: {
  pricing: Pricing;
  labels: { free: string; paid: string; enterprise: string };
}) {
  const plans = [
    { key: "free", label: labels.free, description: pricing.free },
    { key: "paid", label: labels.paid, description: pricing.paid },
    { key: "enterprise", label: labels.enterprise, description: pricing.enterprise },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {plans.map((plan) => (
        <div
          key={plan.key}
          className={`p-4 rounded-xl border ${
            plan.key === "paid"
              ? "border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-900/20"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase ${
              plan.key === "paid"
                ? "text-brand-600 dark:text-brand-400"
                : "text-gray-500"
            }`}
          >
            {plan.label}
          </span>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            {plan.description}
          </p>
        </div>
      ))}
    </div>
  );
}
