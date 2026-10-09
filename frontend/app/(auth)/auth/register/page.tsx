import Link from "next/link";

import RegisterForm from "./registerForm";

export default function RegisterPage() {
  return (
    <section className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 text-slate-950 shadow-2xl shadow-black/20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
        Get started
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500">Open your secure PayCore account in minutes.</p>
      
      <RegisterForm />

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-cyan-700 hover:text-cyan-900">Sign in</Link>
      </p>
    </section>
  );
}
