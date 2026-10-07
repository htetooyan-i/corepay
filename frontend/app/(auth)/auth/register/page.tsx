import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className="rounded-3xl bg-white p-8 text-slate-950 shadow-2xl shadow-black/20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
        Get started
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500">Open your secure PayCore account in minutes.</p>
      <form className="mt-8 space-y-5">
        <label className="block text-sm font-medium">
          Full name
          <input type="text" name="name" autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
        </label>
        <label className="block text-sm font-medium">
          Email address
          <input type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input type="password" name="password" autoComplete="new-password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
        </label>
        <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">
          Create account
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-cyan-700 hover:text-cyan-900">Sign in</Link>
      </p>
    </section>
  );
}
