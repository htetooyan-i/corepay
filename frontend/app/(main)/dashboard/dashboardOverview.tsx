"use client";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { get } from "@/lib/api";
import type { Account } from "@/types/Account";

export default function DashboardOverview() {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccount, setHasAccount] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await get<Account>("/accounts/me");
        setAccount(response);
      } catch (requestError) {
        if (isAxiosError(requestError) && requestError.response?.status === 404) {
          setHasAccount(false);
        } else {
          console.error("Error fetching account for overview:", requestError);
          setError("We couldn't load your account overview. Please refresh and try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAccount();
  }, []);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <p className="text-sm text-slate-500">Loading account overview...</p>
      </section>
    );
  }

  if (!hasAccount) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <h2 className="text-lg font-semibold">No bank account yet</h2>
        <p className="mt-2 text-sm text-slate-500">
          Create your bank account to see your balance and account activity here.
        </p>
        <a
          href="/accounts"
          className="mt-6 inline-flex rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
        >
          Create bank account
        </a>
      </section>
    );
  }

  if (!account) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section>
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <p className="text-sm text-slate-500">
          {account.user
            ? `${account.user.firstName} ${account.user.lastName}'s account`
            : "PayCore personal account"}
        </p>
        <p className="mt-6 text-3xl font-semibold">{formatBalance(account.balance)}</p>
        <p className="mt-4 text-sm text-slate-500">Account ID: {account.id}</p>
        <p className="mt-2 text-sm text-slate-500">Status: {account.status}</p>
      </article>
    </section>
  );
}

function formatBalance(balance: Account["balance"]) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balance);
}
