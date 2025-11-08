import { ReactNode } from "react";
import clsx from "clsx";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon?: ReactNode;
  tone?: "default" | "positive" | "negative" | "accent";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-white border-slate-200",
  positive: "bg-emerald-50 border-emerald-200",
  negative: "bg-rose-50 border-rose-200",
  accent: "bg-indigo-50 border-indigo-200"
};

export function StatCard({ title, value, trend, icon, tone = "default" }: StatCardProps) {
  return (
    <div
      className={clsx(
        "flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition hover:shadow-md",
        toneStyles[tone]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        {icon && <span className="text-primary-dark/70">{icon}</span>}
      </div>
      {trend && <p className="mt-4 text-xs font-medium text-slate-500">{trend}</p>}
    </div>
  );
}
