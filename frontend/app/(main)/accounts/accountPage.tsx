"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { get } from "@/lib/api";
import { post } from "@/lib/api";
import { downloadStatementPdf } from "@/lib/transactionPdf";
import type { Account } from "@/types/Account";
import type { User } from "@/types/User";

export default function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchAccountData = async () => {
        try {
          const response = await get<Account>("/accounts/me");
          setAccount(response);
          setHasAccount(true);
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 404) {
            setHasAccount(false);
          } else {
            console.error("Error fetching account data:", error);
            setError("We couldn't load your account. Please refresh and try again.");
          }
        } finally {
          setIsLoading(false);
        }
    };

    void fetchAccountData();
  }, []);

  const handleCreateAccount = async () => {
    setIsCreating(true);
    setError("");

    try {
        const user = await get<User>("/users/me");
        await post("/accounts", { userId: user.id });
        const response = await get<Account>("/accounts/me");
        setAccount(response);
        setHasAccount(true);
    } catch (error) {
        console.error("Error creating account:", error);
        setError("We couldn't create your account. Please try again.");
    } finally {
        setIsCreating(false);
    }
  };

  const handleDownloadStatement = async () => {
    if (!account) return;

    setIsDownloading(true);
    setError("");
    try {
      const transactions = await get<StatementTransaction[]>(
        `/transactions/${account.id}`,
      );
      downloadStatementPdf({
        accountId: account.id,
        accountHolder: account.user
          ? `${account.user.firstName} ${account.user.lastName}`
          : "PayCore account",
        transactions: transactions.map((transaction) => ({
          ...transaction,
          counterparty: getCounterparty(transaction, account.id),
          direction:
            transaction.transactionType === "DEPOSIT" ||
            transaction.receiverAccount.id === account.id
              ? "incoming"
              : "outgoing",
        })),
      });
    } catch (requestError) {
      console.error("Error downloading account statement:", requestError);
      setError("We couldn't download your statement. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <p className="text-sm text-slate-500">Loading account details...</p>
        </section>
    );
  }

  if (!hasAccount) {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <h2 className="text-xl font-semibold">Open your PayCore account</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            You do not have a bank account yet. Create one to start managing your balance and transactions.
          </p>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            type="button"
            className="mt-6 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleCreateAccount}
            disabled={isCreating}
          >
            {isCreating ? "Creating account..." : "Create bank account"}
          </button>
        </section>
    );
  }

  if (!account) {
    return (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <p className="text-sm text-red-600">{error}</p>
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
        <button
          type="button"
          onClick={handleDownloadStatement}
          disabled={isDownloading}
          className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDownloading ? "Preparing statement..." : "Download statement"}
        </button>
        <button type="button" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          View account details
        </button>
      </div>
    </section>
  );
}

type StatementTransaction = {
  id: string;
  amount: number;
  transactionType: string;
  transactionStatus: string;
  createdAt: string;
  senderAccount: Account;
  receiverAccount: Account;
};

function getCounterparty(transaction: StatementTransaction, accountId: string) {
  const account = transaction.receiverAccount.id === accountId
    ? transaction.senderAccount
    : transaction.receiverAccount;

  return account.user
    ? `${account.user.firstName} ${account.user.lastName}`
    : `Account ${account.id.slice(0, 8)}`;
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
