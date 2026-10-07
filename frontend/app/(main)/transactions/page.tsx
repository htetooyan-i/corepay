export default function TransactionsPage() {
  return <PageIntro title="Transactions" description="Review and search activity from your PayCore account." />;
}

function PageIntro({ title, description }: { title: string; description: string }) {
  return <div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Activity</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-3 text-slate-600">{description}</p></div>;
}
