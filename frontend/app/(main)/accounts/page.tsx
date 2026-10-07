export default function AccountsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro title="My account" description="View your balance, account details, and statements in one place." />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <p className="text-sm text-slate-500">PayCore personal account</p>
        <p className="mt-4 text-3xl font-semibold">$12,840.50</p>
        <p className="mt-3 text-sm text-slate-500">Account ending in 4281</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Download statement
          </button>
          <button type="button" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            View account details
          </button>
        </div>
      </section>
    </div>
  );
}

function PageIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Banking</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
}
