"use client";

import { useWorkforceStore } from "@/lib/store";
import clsx from "clsx";
import { useMemo, useState } from "react";

export function ContractorLedger() {
  const { contractors, labourers, releasePayment } = useWorkforceStore((state) => ({
    contractors: Object.values(state.contractors),
    labourers: state.labourers,
    releasePayment: state.releasePayment
  }));

  const [selectedContractor, setSelectedContractor] = useState<string | null>(contractors[0]?.id ?? null);
  const [releaseAmount, setReleaseAmount] = useState(0);

  const ledger = useMemo(() => {
    return contractors.map((contractor) => {
      const mappedLabourers = contractor.labourers.map((labourerId) => labourers[labourerId]);
      const totalRate = mappedLabourers.reduce((acc, labourer) => acc + (labourer?.rate ?? 0), 0);
      return {
        contractor,
        labourerCount: mappedLabourers.length,
        dailyBurn: totalRate,
        upcomingMilestones: Math.round(contractor.balance / Math.max(totalRate, 1))
      };
    });
  }, [contractors, labourers]);

  const handleRelease = () => {
    if (!selectedContractor || !releaseAmount) return;
    releasePayment(selectedContractor, releaseAmount);
    setReleaseAmount(0);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Contractor Ledger</h2>
          <p className="text-sm text-slate-500">
            Track contractor balances, runway, and trigger payment releases with smart safeguards.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            value={selectedContractor ?? ""}
            onChange={(event) => setSelectedContractor(event.target.value)}
          >
            {contractors.map((contractor) => (
              <option key={contractor.id} value={contractor.id}>
                {contractor.name} · {contractor.company}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            placeholder="Release amount"
            className="w-36 rounded-full border border-slate-300 px-4 py-2 text-sm"
            value={releaseAmount ? releaseAmount : ""}
            onChange={(event) => setReleaseAmount(Number(event.target.value))}
          />
          <button
            onClick={handleRelease}
            className={clsx(
              "rounded-full px-5 py-2 text-sm font-semibold text-white transition",
              releaseAmount > 0 && selectedContractor
                ? "bg-primary hover:bg-primary-dark"
                : "bg-slate-300 text-slate-500"
            )}
            disabled={!(releaseAmount > 0 && selectedContractor)}
            type="button"
          >
            Release Payment
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {ledger.map(({ contractor, labourerCount, dailyBurn, upcomingMilestones }) => (
          <div key={contractor.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{contractor.name}</h3>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {contractor.company}
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Balance ₹{contractor.balance.toLocaleString("en-IN")}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div>
                <dt className="font-medium text-slate-500">Crew size</dt>
                <dd className="text-lg font-semibold text-slate-800">{labourerCount}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Daily burn</dt>
                <dd className="text-lg font-semibold text-slate-800">₹{dailyBurn.toLocaleString("en-IN")}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Runway</dt>
                <dd className="text-lg font-semibold text-slate-800">{upcomingMilestones} days</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Contact</dt>
                <dd className="text-sm text-slate-600">{contractor.contact}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
