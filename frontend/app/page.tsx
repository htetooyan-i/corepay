import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white sm:py-12">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-white text-slate-950 shadow-2xl shadow-cyan-950/30 lg:min-h-[calc(100vh-6rem)] lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-cyan-400 p-8 sm:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-950">
              PayCore
            </p>
            <div className="mt-20 max-w-lg lg:mt-32">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-950/70">
                One account. Complete control.
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
                Your money, clearly in view.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-8 text-cyan-950/75">
                One secure PayCore account for your everyday payments,
                transfers, and financial overview.
              </p>
            </div>
          </div>
          <p className="mt-16 text-sm font-medium text-cyan-950/70">
            Secure access to your personal financial workspace.
          </p>
        </div>
        <div className="flex w-full flex-1 flex-col justify-center p-8 sm:p-12 lg:max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Welcome back
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Your account is ready when you are.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Sign in to continue to your PayCore account.
          </p>
          <div className="mt-8 space-y-3">
            <Link
              href="/auth/login"
              className="block rounded-xl bg-slate-950 px-6 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="block rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Create your one account
            </Link>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have a PayCore account? Sign in above.
          </p>
        </div>
      </section>
    </main>
  );
}
