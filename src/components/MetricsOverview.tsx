"use client";

import { StatCard } from "@/components/StatCard";
import { useWorkforceStore } from "@/lib/store";
import { UsersIcon, WalletIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { useMemo } from "react";

export function MetricsOverview() {
  const { labourers, contractors, workOrders } = useWorkforceStore((state) => ({
    labourers: Object.values(state.labourers),
    contractors: Object.values(state.contractors),
    workOrders: Object.values(state.workOrders)
  }));

  const metrics = useMemo(() => {
    const attendanceDates = labourers.flatMap((labourer) => labourer.attendance.map((record) => record.date));
    const latestDate = attendanceDates.sort((a, b) => (dayjs(a).isAfter(b) ? -1 : 1))[0];

    const presentOnLatest = labourers.reduce((acc, labourer) => {
      if (!latestDate) return acc;
      const record = labourer.attendance.find((item) => item.date === latestDate);
      if (!record || record.status === "absent") {
        return acc;
      }
      return acc + 1;
    }, 0);

    const blockedJobs = workOrders.filter((workOrder) => workOrder.status === "blocked").length;

    const totalBalance = contractors.reduce((acc, contractor) => acc + contractor.balance, 0);

    return {
      presentRate: labourers.length && latestDate ? Math.round((presentOnLatest / labourers.length) * 100) : 0,
      blockedJobs,
      totalBalance
    };
  }, [labourers, contractors, workOrders]);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Attendance Health"
        value={`${metrics.presentRate}% present`
        }
        trend="Target: 92%"
        icon={<UsersIcon className="h-8 w-8" />}
        tone={metrics.presentRate >= 92 ? "positive" : metrics.presentRate >= 85 ? "accent" : "negative"}
      />
      <StatCard
        title="Blocked Jobs"
        value={`${metrics.blockedJobs}`}
        trend="Resolve escalations within 4h"
        icon={<WrenchScrewdriverIcon className="h-8 w-8" />}
        tone={metrics.blockedJobs === 0 ? "positive" : "negative"}
      />
      <StatCard
        title="Pending Contractor Balance"
        value={`₹${metrics.totalBalance.toLocaleString("en-IN")}`}
        trend="Plan payout release"
        icon={<WalletIcon className="h-8 w-8" />}
        tone="accent"
      />
    </section>
  );
}
