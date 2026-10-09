"use client";

import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";

import { get } from "@/lib/api";
import type { Account } from "@/types/Account";

type Direction = "incoming" | "outgoing";
type DirectionFilter = "all" | Direction;
type DateFilter = "all" | "month" | "90-days";
type TransactionType = "DEPOSIT" | "WITHDRAW" | "PAYMENT" | "TRANSFER" | "REFUND";
type TypeFilter = "all" | TransactionType;

type Transaction = {
  id: string;
  senderAccount: Account;
  receiverAccount: Account;
  amount: number;
  transactionType: TransactionType;
  transactionStatus: string;
  createdAt: string;
};

type DisplayTransaction = Transaction & {
  direction: Direction;
  counterparty: string;
};

export default function TransactionsList() {
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState<DirectionFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasAccount, setHasAccount] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const currentAccount = await get<Account>("/accounts/me");
        const accountTransactions = await get<Transaction[]>(
          `/transactions/${currentAccount.id}`,
        );
        setAccount(currentAccount);
        setTransactions(accountTransactions);
      } catch (requestError) {
        if (isAxiosError(requestError) && requestError.response?.status === 404) {
          setHasAccount(false);
        } else {
          console.error("Error fetching transactions:", requestError);
          setError("We couldn't load your transactions. Please refresh and try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTransactions();
  }, []);

  const displayTransactions = useMemo<DisplayTransaction[]>(() => {
    if (!account) {
      return [];
    }

    const query = search.trim().toLowerCase();
    const now = new Date();
    const dateLimit =
      dateFilter === "month"
        ? new Date(now.getFullYear(), now.getMonth(), 1)
        : dateFilter === "90-days"
          ? new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          : null;

    return transactions
      .map((transaction) => {
        const isIncoming =
          transaction.transactionType === "DEPOSIT" ||
          transaction.receiverAccount.id === account.id;
        const counterpartyAccount = isIncoming
          ? transaction.senderAccount
          : transaction.receiverAccount;
        const counterparty =
          counterpartyAccount.user
            ? `${counterpartyAccount.user.firstName} ${counterpartyAccount.user.lastName}`
            : `Account ${counterpartyAccount.id.slice(0, 8)}`;

        const transactionDirection: Direction = isIncoming ? "incoming" : "outgoing";

        return {
          ...transaction,
          direction: transactionDirection,
          counterparty,
        };
      })
      .filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const matchesDirection =
          direction === "all" || transaction.direction === direction;
        const matchesType =
          typeFilter === "all" || transaction.transactionType === typeFilter;
        const matchesDate = !dateLimit || transactionDate >= dateLimit;
        const matchesSearch =
          !query ||
          transaction.counterparty.toLowerCase().includes(query) ||
          transaction.transactionType.toLowerCase().includes(query) ||
          transaction.transactionStatus.toLowerCase().includes(query) ||
          transaction.id.toLowerCase().includes(query);

        return matchesDirection && matchesType && matchesDate && matchesSearch;
      })
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
      );
  }, [account, dateFilter, direction, search, transactions, typeFilter]);

  const incomingCount = transactions.filter((transaction) =>
    account &&
    (transaction.transactionType === "DEPOSIT" ||
      transaction.receiverAccount.id === account.id),
  ).length;
  const outgoingCount = transactions.length - incomingCount;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!hasAccount) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
        <h2 className="text-xl font-semibold">Open your account to see transactions</h2>
        <p className="mt-2 text-sm text-slate-500">
          Your transaction history will appear here after you create a PayCore account.
        </p>
        <a
          href="/accounts"
          className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Go to my account
        </a>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-100 bg-white p-8 shadow-lg shadow-slate-200/60">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total activity" value={transactions.length} tone="dark" />
        <SummaryCard label="Incoming" value={incomingCount} tone="green" />
        <SummaryCard label="Outgoing" value={outgoingCount} tone="orange" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">All transactions</h2>
            <p className="mt-1 text-sm text-slate-500">
              {displayTransactions.length} {displayTransactions.length === 1 ? "result" : "results"} found
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <span className="sr-only">Search transactions</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search transactions"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 sm:w-56"
              />
            </label>
            <label>
              <span className="sr-only">Filter by direction</span>
              <select
                value={direction}
                onChange={(event) => setDirection(event.target.value as DirectionFilter)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-500 sm:w-36"
              >
                <option value="all">All flows</option>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by date</span>
              <select
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value as DateFilter)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-500 sm:w-36"
              >
                <option value="all">All time</option>
                <option value="month">This month</option>
                <option value="90-days">Last 90 days</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by transaction type</span>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-500 sm:w-36"
              >
                <option value="all">All types</option>
                <option value="DEPOSIT">Deposits</option>
                <option value="WITHDRAW">Withdrawals</option>
                <option value="TRANSFER">Transfers</option>
                <option value="PAYMENT">Payments</option>
                <option value="REFUND">Refunds</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-100">
          {displayTransactions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {displayTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                $
              </div>
              <h3 className="mt-4 font-semibold">No transactions found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your filters or make a transfer to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-100" />
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "dark" | "green" | "orange";
}) {
  const toneClass = {
    dark: "bg-slate-950 text-white",
    green: "border border-emerald-100 bg-emerald-50 text-emerald-950",
    orange: "border border-orange-100 bg-orange-50 text-orange-950",
  }[tone];

  return (
    <article className={`rounded-2xl p-5 shadow-lg shadow-slate-200/40 ${toneClass}`}>
      <p className="text-sm font-semibold opacity-85">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-semibold opacity-75">Transactions</p>
    </article>
  );
}

function TransactionRow({ transaction }: { transaction: DisplayTransaction }) {
  const isIncoming = transaction.direction === "incoming";

  return (
    <article className="grid gap-3 px-4 py-4 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_5.5rem_8rem] sm:items-center sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
            isIncoming ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
          }`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {isIncoming ? (
              <>
                <path d="M5 5l14 14" />
                <path d="M19 11v8h-8" />
              </>
            ) : (
              <>
                <path d="M5 19L19 5" />
                <path d="M11 5h8v8" />
              </>
            )}
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{transaction.counterparty}</p>
          <p className="mt-1 text-sm text-slate-500">
            {formatTransactionType(transaction.transactionType)} ·{" "}
            {isIncoming ? "Incoming" : "Outgoing"} · {formatDate(transaction.createdAt)}
          </p>
        </div>
      </div>
      <span className="w-22 justify-self-start rounded-full bg-slate-100 px-2.5 py-1 text-center text-xs font-medium capitalize text-slate-600 sm:justify-self-end">
        {transaction.transactionStatus.toLowerCase()}
      </span>
      <p className={`min-w-32 text-left font-semibold sm:text-right ${isIncoming ? "text-emerald-700" : "text-orange-700"}`}>
        {isIncoming ? "+" : "-"}
        {formatAmount(transaction.amount)}
      </p>
    </article>
  );
}

function formatTransactionType(type: TransactionType) {
  const labels: Record<TransactionType, string> = {
    DEPOSIT: "Deposit",
    WITHDRAW: "Withdrawal",
    PAYMENT: "Payment",
    TRANSFER: "Transfer",
    REFUND: "Refund",
  };

  return labels[type];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
