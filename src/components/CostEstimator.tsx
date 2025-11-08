"use client";

import { useWorkforceStore } from "@/lib/store";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

export function CostEstimator() {
  const compute = useWorkforceStore((state) => state.computeCostSummary);
  const [from, setFrom] = useState(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
  const [to, setTo] = useState(dayjs().format("YYYY-MM-DD"));

  const summaries = useMemo(() => compute(from, to), [compute, from, to]);
  const total = summaries.reduce((acc, summary) => acc + summary.payableAmount, 0);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Payout Forecaster</h2>
          <p className="text-sm text-slate-500">Generate contractor-ready payout statements with date filters and labour-level breakups.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-slate-500">From</span>
            <input
              type="date"
              className="rounded-full border border-slate-300 px-3 py-1"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-slate-500">To</span>
            <input
              type="date"
              className="rounded-full border border-slate-300 px-3 py-1"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 overflow-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Labourer</th>
              <th className="px-3 py-2 text-left">Contractor</th>
              <th className="px-3 py-2 text-right">Days</th>
              <th className="px-3 py-2 text-right">Hours</th>
              <th className="px-3 py-2 text-right">Payable (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {summaries.map((summary) => (
              <tr key={summary.labourerId}>
                <td className="px-3 py-2 font-medium text-slate-800">{summary.labourerName}</td>
                <td className="px-3 py-2 text-slate-600">{summary.contractorName}</td>
                <td className="px-3 py-2 text-right">{summary.totalDays.toFixed(1)}</td>
                <td className="px-3 py-2 text-right">{summary.totalHours.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-semibold text-slate-900">
                  {summary.payableAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 text-sm font-semibold text-slate-700">
            <tr>
              <td className="px-3 py-3" colSpan={4}>
                Total payable
              </td>
              <td className="px-3 py-3 text-right">
                ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
