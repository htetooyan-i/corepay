import Link from "next/link";
import type { ReactNode } from "react";
import DashboardHeader from "./dashboardHeader";

const navigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/accounts", label: "My account" },
  { href: "/transfers", label: "Transfers" },
  { href: "/transactions", label: "Transactions" },
  { href: "/settings", label: "Settings" },
];

export default function MainLayout({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 md:block">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-cyan-300">Pay</span>Core
        </Link>
        <nav className="mt-12 space-y-2" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-cyan-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64">
        <DashboardHeader />
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
