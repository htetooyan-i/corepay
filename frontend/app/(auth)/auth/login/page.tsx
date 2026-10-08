import Link from "next/link";

import LoginForm from "./loginForm";


export default function LoginPage() {

  return (
    <section className="rounded-3xl bg-white p-8 text-slate-950 shadow-2xl shadow-black/20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
        Welcome back
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign in to PayCore</h1>
      <p className="mt-2 text-sm text-slate-500">
        Access your accounts and manage your money securely.
      </p>

      <LoginForm/>
      
      <p className="mt-8 text-center text-sm text-slate-500">
        New to PayCore?{" "}
        <Link href="/auth/register" className="font-semibold text-cyan-700 hover:text-cyan-900">
          Create an account
        </Link>
      </p>
    </section>
  );
}
