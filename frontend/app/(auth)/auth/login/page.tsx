import Link from "next/link";

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
      <form className="mt-8 space-y-5">
        <label className="block text-sm font-medium">
          Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </label>
        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-sm font-semibold text-cyan-700 hover:text-cyan-900">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Sign in
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-500">
        New to PayCore?{" "}
        <Link href="/auth/register" className="font-semibold text-cyan-700 hover:text-cyan-900">
          Create an account
        </Link>
      </p>
    </section>
  );
}
