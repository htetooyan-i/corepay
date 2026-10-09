import TransferForm from "./transferForm";

export default function TransfersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Payments</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Transfers</h1>
      <p className="mt-3 text-slate-600">Manage money in and out of your PayCore account.</p>
      <TransferForm />
    </div>
  );
}
