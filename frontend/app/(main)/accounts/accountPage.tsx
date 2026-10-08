"use client";

import { useEffect, useState } from "react";

import type { Account } from "@/types/Account";
import { get } from "@/lib/api";

export default function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
        try {
        const response = await get<Account>("/accounts/me");
        setAccount(response);
        } catch (error) {
        console.error("Error fetching user data:", error);
        }
    };

    void fetchAccountData();
  }, []);

  if (!account) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <p className="text-sm text-slate-500">Loading account details...</p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <p className="text-sm text-slate-500">
        {account.user
          ? `${account.user.firstName} ${account.user.lastName}'s account`
          : "PayCore personal account"}
      </p>
      <p className="mt-4 text-3xl font-semibold">{formatBalance(account.balance)}</p>
      <p className="mt-3 text-sm text-slate-500">Account ID: {account.id}</p>
      <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
        <AccountDetail label="Status" value={account.status} />
        <AccountDetail label="Email" value={account.user?.email ?? "-"} />
        <AccountDetail label="Phone" value={account.user?.phoneNumber ?? "-"} />
        <AccountDetail label="Opened" value={formatDate(account.createdAt)} />
      </dl>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Download statement
        </button>
        <button type="button" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          View account details
        </button>
      </div>
    </section>
  );
}

function formatBalance(balance: Account["balance"]) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balance);
}

function formatDate(date: Account["createdAt"]) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function AccountDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
