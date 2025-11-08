"use client";

import { useWorkforceStore } from "@/lib/store";
import { WorkOrderStatus } from "@/lib/types";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo } from "react";

dayjs.extend(relativeTime);

const statusLabels: Record<WorkOrderStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  blocked: "Blocked"
};

const statusTone: Record<WorkOrderStatus, string> = {
  scheduled: "border-sky-200 bg-sky-50",
  in_progress: "border-amber-200 bg-amber-50",
  completed: "border-emerald-200 bg-emerald-50",
  blocked: "border-rose-200 bg-rose-50"
};

export function WorkOrderBoard() {
  const { workOrders, contractors, labourers, updateWorkOrderStatus } = useWorkforceStore((state) => ({
    workOrders: Object.values(state.workOrders),
    contractors: state.contractors,
    labourers: state.labourers,
    updateWorkOrderStatus: state.updateWorkOrderStatus
  }));

  const grouped = useMemo(() => {
    return workOrders.reduce<Record<WorkOrderStatus, typeof workOrders>>(
      (acc, workOrder) => {
        acc[workOrder.status].push(workOrder);
        return acc;
      },
      { scheduled: [], in_progress: [], completed: [], blocked: [] }
    );
  }, [workOrders]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Work Order Intelligence</h2>
          <p className="text-sm text-slate-500">
            Monitor execution health across all active jobs. Update status inline and keep crews aligned.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {Object.entries(grouped).map(([status, items]) => (
          <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {statusLabels[status as WorkOrderStatus]} ({items.length})
              </h3>
            </div>
            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-white p-3 text-xs text-slate-400">
                  No work orders here yet
                </p>
              ) : (
                items.map((item) => {
                  const contractor = contractors[item.contractorId];
                  const assigned = item.labourers.map((labId) => labourers[labId]?.name ?? "-");
                  const timeline =
                    item.status === "completed"
                      ? `Wrapped ${dayjs(item.endDate ?? item.startDate).fromNow()}`
                      : `Started ${dayjs(item.startDate).fromNow()}`;
                  return (
                    <article
                      key={item.id}
                      className={clsx(
                        "rounded-2xl border p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                        statusTone[item.status]
                      )}
                    >
                      <header className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-semibold text-slate-900">{item.title}</h4>
                          <p className="text-xs uppercase tracking-wide text-slate-500">{item.location}</p>
                        </div>
                        <select
                          className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold"
                          value={item.status}
                          onChange={(event) =>
                            updateWorkOrderStatus(item.id, event.target.value as WorkOrderStatus)
                          }
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </header>
                      <dl className="mt-3 space-y-2 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <dt className="font-medium text-slate-500">Contractor</dt>
                          <dd className="text-slate-800">{contractor?.name ?? "Unassigned"}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="font-medium text-slate-500">Crew</dt>
                          <dd className="text-right text-slate-800">{assigned.join(", ")}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="font-medium text-slate-500">Timeline</dt>
                          <dd className="text-slate-800">{timeline}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="font-medium text-slate-500">Estimate</dt>
                          <dd className="text-slate-800">{item.estimatedHours}h</dd>
                        </div>
                      </dl>
                      {item.notes && <p className="mt-3 text-xs text-slate-600">{item.notes}</p>}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
