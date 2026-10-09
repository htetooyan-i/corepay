"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";

import { get, post } from "@/lib/api";
import type { Account } from "@/types/Account";

import { TransactionPasswordDialog } from "./transactionPasswordDialog";

type TransactionType = "DEPOSIT" | "WITHDRAW" | "TRANSFER";

const transactionOptions: {
  type: TransactionType;
  label: string;
  description: string;
}[] = [
  {
    type: "DEPOSIT",
    label: "Deposit",
    description: "Add funds to your PayCore account.",
  },
  {
    type: "WITHDRAW",
    label: "Withdraw",
    description: "Move funds out of your PayCore account.",
  },
  {
    type: "TRANSFER",
    label: "Transfer",
    description: "Send funds to another PayCore account.",
  },
];

export default function TransferForm() {
  const [account, setAccount] = useState<Account | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>("TRANSFER");
  const [amount, setAmount] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [transactionPassword, setTransactionPassword] = useState("");
  const [hasAccount, setHasAccount] = useState(true);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setAccount(await get<Account>("/accounts/me"));
      } catch (requestError) {
        if (isAxiosError(requestError) && requestError.response?.status === 404) {
          setHasAccount(false);
        } else {
          console.error("Error fetching account for transactions:", requestError);
          setError("We couldn't load your account. Please refresh and try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAccount();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!account) return;

    setTransactionPassword("");
    setPasswordError("");
    setError("");
    setSuccess("");
    setIsPasswordModalOpen(true);
  };

  const closePasswordDialog = () => {
    if (isSubmitting) return;
    setIsPasswordModalOpen(false);
    setTransactionPassword("");
    setPasswordError("");
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!account || !transactionPassword) {
      setPasswordError("Enter your password to authorize this transaction.");
      return;
    }

    setIsSubmitting(true);
    setPasswordError("");

    try {
      await post("/transactions", {
        senderId: transactionType === "DEPOSIT" ? null : account.id,
        receiverId: transactionType === "WITHDRAW" ? null : transactionType === "TRANSFER" ? receiverId : account.id,
        amount: Number(amount),
        transactionType,
        currentPassword: transactionPassword,
      });
      setAccount(await get<Account>("/accounts/me"));
      setAmount("");
      setReceiverId("");
      setTransactionPassword("");
      setIsPasswordModalOpen(false);
      setSuccess(`${transactionType[0]}${transactionType.slice(1).toLowerCase()} submitted successfully.`);
    } catch (requestError) {
      console.error("Error creating transaction:", requestError);
      const message = isAxiosError(requestError) && typeof requestError.response?.data === "string"
        ? requestError.response.data
        : "We couldn't complete this transaction. Check the details and try again.";
      setPasswordError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!hasAccount) {
    return (
      <>
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
          <h2 className="text-xl font-semibold">Open your PayCore account first</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
            You need an account before you can deposit, withdraw, or transfer money.
          </p>
          <Link href="/accounts" className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Open account
          </Link>
        </section>
      </>
    );
  }

  if (!account) {
    return <p className="mt-8 text-sm text-red-600">{error}</p>;
  }

  const selectedOption = transactionOptions.find((option) => option.type === transactionType);

  return (
    <>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Move money</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">What would you like to do?</h2>
            <p className="mt-2 text-sm text-slate-500">Choose a transaction type and enter the details below.</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Transaction type">
            {transactionOptions.map((option) => {
              const isSelected = option.type === transactionType;
              return (
                <button
                  key={option.type}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setTransactionType(option.type);
                    setError("");
                    setSuccess("");
                  }}
                  className={`rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-50 ring-2 ring-cyan-100"
                      : "border-slate-200 hover:border-cyan-200 hover:bg-slate-50"
                  }`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${isSelected ? "bg-cyan-300 text-slate-950" : "bg-slate-100 text-slate-600"}`}>
                    {option.type === "DEPOSIT" ? "+" : option.type === "WITHDRAW" ? "−" : "→"}
                  </span>
                  <span className="mt-4 block text-sm font-semibold">{option.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{option.description}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 border-t border-slate-100 pt-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Amount</span>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">$</span>
                  <input
                    required
                    min="0.01"
                    step="0.01"
                    type="number"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </label>

              {transactionType === "TRANSFER" ? (
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Recipient account ID</span>
                  <input
                    required
                    type="text"
                    value={receiverId}
                    onChange={(event) => setReceiverId(event.target.value)}
                    placeholder="Enter the other account ID"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>
              ) : (
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  {selectedOption?.description}
                  <p className="mt-2 text-xs text-slate-400">Your account ending in {account.id.slice(-6)} will be used.</p>
                </div>
              )}
            </div>

            {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
            {success && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700" role="status">{success}</p>}
            <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
              {isSubmitting ? "Submitting..." : `Continue with ${selectedOption?.label.toLowerCase()}`}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-2xl bg-slate-950 p-6 text-white shadow-lg shadow-slate-300/40">
          <p className="text-sm text-slate-400">Available balance</p>
          <p className="mt-3 text-3xl font-semibold">{formatBalance(account.balance)}</p>
          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Your account</p>
            <p className="mt-2 break-all text-sm text-slate-200">{account.id}</p>
            <p className="mt-5 text-xs leading-5 text-slate-400">Only transfer to an account ID you trust. Deposits and withdrawals are processed against your PayCore account.</p>
          </div>
        </aside>
      </div>
      {isPasswordModalOpen && (
        <TransactionPasswordDialog
          password={transactionPassword}
          error={passwordError}
          isSubmitting={isSubmitting}
          transactionLabel={selectedOption?.label.toLowerCase() ?? "transaction"}
          onChange={(value) => {
            setTransactionPassword(value);
            setPasswordError("");
          }}
          onSubmit={handlePasswordSubmit}
          onClose={closePasswordDialog}
        />
      )}
    </>
  );
}

function LoadingState() {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
      <p className="text-sm text-slate-500">Loading your transaction options...</p>
    </section>
  );
}

function formatBalance(balance: Account["balance"]) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balance);
}
