import { SparklesIcon } from "@heroicons/react/24/outline";

export function Header() {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-white to-primary/10 p-8 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
          <SparklesIcon className="h-5 w-5" />
          Workforce Command Center
        </div>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
          Plumbing Labour Agent Console
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Align contractors, crews, and payouts in one AI-assisted cockpit. Monitor attendance, resolve blocks, and
          surface negotiation scripts in seconds.
        </p>
      </div>
      <div className="flex flex-col gap-3 text-sm text-slate-600">
        <div className="rounded-2xl border border-primary/30 bg-white px-5 py-4 shadow-inner">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Live Agent Objectives</p>
          <ul className="mt-2 space-y-1">
            <li>✓ Lift present rate above 92%</li>
            <li>✓ Clear blocked spa installation</li>
            <li>✓ Release ₹30k to BluePipe</li>
          </ul>
        </div>
      </div>
    </header>
  );
}
