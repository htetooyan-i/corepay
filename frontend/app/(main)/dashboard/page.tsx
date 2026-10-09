import DashboardOverview from "./dashboardOverview";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your account at a glance</h1>
      </div>
      <DashboardOverview />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/transfers" className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200">Make a transfer</a>
          <a href="/accounts" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">View account</a>
        </div>
      </section>
    </div>
  );
}
