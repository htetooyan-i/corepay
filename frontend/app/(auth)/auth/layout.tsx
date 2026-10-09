import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-950">
      <div className="w-full max-w-4xl">
        <Link
          href="/"
          className="mb-8 block text-center text-xl font-bold tracking-tight"
        >
          <span className="text-cyan-700">Pay</span>Core
        </Link>
        {children}
      </div>
    </main>
  );
}
