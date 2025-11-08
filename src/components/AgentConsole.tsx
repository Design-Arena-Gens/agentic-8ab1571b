"use client";

import { playbooks } from "@/data/seed";
import { useWorkforceStore } from "@/lib/store";
import clsx from "clsx";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

interface Suggestion {
  title: string;
  body: string;
  priority: "low" | "medium" | "high";
}

const priorityTone: Record<Suggestion["priority"], string> = {
  high: "border-rose-200 bg-rose-50 text-rose-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-sky-200 bg-sky-50 text-sky-700"
};

function useAgentSuggestions(): Suggestion[] {
  const { contractors, labourers, workOrders } = useWorkforceStore((state) => ({
    contractors: Object.values(state.contractors),
    labourers: Object.values(state.labourers),
    workOrders: Object.values(state.workOrders)
  }));

  return useMemo(() => {
    const suggestions: Suggestion[] = [];
    const today = dayjs();

    labourers.forEach((labourer) => {
      const recentAbsence = labourer.attendance.find((record) => record.status === "absent");
      if (recentAbsence) {
        const daysAgo = today.diff(dayjs(recentAbsence.date), "day");
        if (daysAgo <= 3) {
          suggestions.push({
            title: `Resolve attendance dip for ${labourer.name}`,
            body: `${labourer.name} missed work ${daysAgo} day(s) ago. Trigger the attendance recovery playbook and align contractor.`,
            priority: "high"
          });
        }
      }
    });

    workOrders.forEach((workOrder) => {
      if (workOrder.status === "blocked") {
        const contractor = contractors.find((c) => c.id === workOrder.contractorId)?.name ?? "Contractor";
        suggestions.push({
          title: `Unblock ${workOrder.title}`,
          body: `${contractor} reports a block: ${workOrder.notes ?? "Reason not logged"}. Prepare follow-up plan to secure fittings and reschedule crew.`,
          priority: "medium"
        });
      }
    });

    contractors.forEach((contractor) => {
      if (contractor.balance > 40000) {
        suggestions.push({
          title: `Schedule payout for ${contractor.name}`,
          body: `${contractor.company} balance is ₹${contractor.balance.toLocaleString("en-IN")}. Prepare negotiation script to part-release funds.`,
          priority: "medium"
        });
      }
    });

    if (suggestions.length === 0) {
      suggestions.push({
        title: "All clear",
        body: "No urgent escalations detected. Continue monitoring attendance and work order timelines.",
        priority: "low"
      });
    }

    return suggestions;
  }, [contractors, labourers, workOrders]);
}

export function AgentConsole() {
  const suggestions = useAgentSuggestions();
  const [selectedPlaybook, setSelectedPlaybook] = useState(playbooks[0]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Agent Signal Center</h2>
              <p className="text-sm text-slate-500">
                AI agent surfaces hotspots automatically and proposes the best playbook to drive resolution.
              </p>
            </div>
          </header>

          <div className="mt-4 space-y-3">
            {suggestions.map((suggestion, index) => (
              <article
                key={`${suggestion.title}-${index}`}
                className={clsx(
                  "rounded-2xl border p-4 text-sm shadow-sm",
                  priorityTone[suggestion.priority]
                )}
              >
                <h3 className="text-base font-semibold text-slate-900">{suggestion.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{suggestion.body}</p>
                <span className="mt-3 inline-block rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Priority: {suggestion.priority.toUpperCase()}
                </span>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Playbooks</h3>
            <div className="mt-3 space-y-3">
              {playbooks.map((playbook) => (
                <button
                  key={playbook.id}
                  onClick={() => setSelectedPlaybook(playbook)}
                  className={clsx(
                    "w-full rounded-2xl border p-4 text-left text-sm transition",
                    selectedPlaybook.id === playbook.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                  )}
                  type="button"
                >
                  <h4 className="text-base font-semibold text-slate-900">{playbook.name}</h4>
                  <p className="mt-1 text-xs text-slate-600">{playbook.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agent Prompt</h4>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{selectedPlaybook.prompt}</p>
            <p className="mt-3 text-xs text-slate-400">
              Feed this prompt to your favourite LLM agent to generate outreach, negotiation scripts, or next steps tailored to the current situation.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
