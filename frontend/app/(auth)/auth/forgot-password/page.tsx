import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <section className="grid overflow-hidden rounded-3xl bg-white text-slate-950 shadow-2xl shadow-black/20 md:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col justify-between bg-cyan-400 p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-950">
            PayCore access
          </p>
          <h1 className="mt-10 text-3xl font-semibold tracking-tight text-cyan-950">
            One account, always within reach.
          </h1>
          <p className="mt-4 text-sm leading-6 text-cyan-950/75">
            Recover access to your existing PayCore account securely. You do
            not need to create another account.
          </p>
        </div>
        <p className="mt-12 text-sm font-medium text-cyan-950/70">
          Your financial workspace is waiting for you.
        </p>
      </div>

      <div className="p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Account recovery
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Reset your password
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter the email linked to your PayCore account and we&apos;ll send
          instructions to securely reset your password.
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
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Send reset link
          </button>
        </form>
        <Link
          href="/auth/login"
          className="mt-8 block text-center text-sm font-semibold text-cyan-700 hover:text-cyan-900"
        >
          Back to sign in
        </Link>
      </div>
    </section>
  );
}
