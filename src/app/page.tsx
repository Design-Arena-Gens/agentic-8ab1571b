import { AttendanceMatrix } from "@/components/AttendanceMatrix";
import { CostEstimator } from "@/components/CostEstimator";
import { AgentConsole } from "@/components/AgentConsole";
import { ContractorLedger } from "@/components/ContractorLedger";
import { Header } from "@/components/Header";
import { MetricsOverview } from "@/components/MetricsOverview";
import { WorkOrderBoard } from "@/components/WorkOrderBoard";

export default function Page() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
      <Header />
      <MetricsOverview />
      <AttendanceMatrix />
      <div className="grid gap-6 lg:grid-cols-2">
        <ContractorLedger />
        <CostEstimator />
      </div>
      <WorkOrderBoard />
      <AgentConsole />
    </main>
  );
}
