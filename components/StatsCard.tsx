import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: "emerald" | "forest" | "amber" | "cream";
}

export default function StatsCard({
  label,
  value,
  description,
  icon,
  trend,
  variant = "emerald",
}: StatsCardProps) {
  const variantStyles = {
    emerald: {
      bg: "bg-white",
      border: "border-gray-100 hover:border-emerald-200",
      iconBg: "bg-emerald-50 text-emerald-600",
      valueColor: "text-forest-900",
    },
    forest: {
      bg: "bg-forest-900 text-white",
      border: "border-forest-800",
      iconBg: "bg-forest-800 text-emerald-400",
      valueColor: "text-white",
    },
    amber: {
      bg: "bg-white",
      border: "border-gray-100 hover:border-amber-200",
      iconBg: "bg-amber-50 text-amber-600",
      valueColor: "text-gray-900",
    },
    cream: {
      bg: "bg-cream-100",
      border: "border-cream-300/40",
      iconBg: "bg-emerald-100 text-emerald-800",
      valueColor: "text-forest-950",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`${style.bg} ${style.border} rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-wider ${
              variant === "forest" ? "text-emerald-300" : "text-gray-500"
            }`}
          >
            {label}
          </p>
          <p className={`text-3xl sm:text-4xl font-extrabold mt-2 ${style.valueColor}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div
            className={`p-3 rounded-xl ${style.iconBg} flex items-center justify-center`}
          >
            {icon}
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-4 pt-3 border-t border-gray-100/50 flex items-center justify-between text-xs">
          {description && (
            <span
              className={variant === "forest" ? "text-gray-300" : "text-gray-500"}
            >
              {description}
            </span>
          )}
          {trend && (
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

