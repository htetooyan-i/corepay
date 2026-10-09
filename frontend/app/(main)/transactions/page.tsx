import TransactionsList from "./transactionsList";

export default function TransactionsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Activity</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Transactions</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Review everything moving in and out of your PayCore account.
        </p>
      </div>
      <TransactionsList />
    </div>
  );
}
