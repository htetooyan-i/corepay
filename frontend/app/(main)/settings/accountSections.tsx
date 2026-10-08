type AccountAccessProps = {
  email: string;
  isLoading: boolean;
  isDeleting: boolean;
  hasUser: boolean;
  onDelete: () => void;
};

export function AccountSections({
  email,
  isLoading,
  isDeleting,
  hasUser,
  onDelete,
}: AccountAccessProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
        <p className="text-lg font-semibold">Account access</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Your account is protected by your sign-in credentials. Contact support if you need help securing access.
        </p>
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Signed-in email</p>
          <p className="mt-1 truncate text-sm text-slate-500">{email || "Loading..."}</p>
        </div>
      </section>
      <section className="rounded-2xl border border-red-200 bg-red-50/60 p-6">
        <p className="text-lg font-semibold text-red-950">Delete account</p>
        <p className="mt-2 text-sm leading-6 text-red-800/80">
          Permanently delete your profile and sign out of PayCore. This cannot be undone.
        </p>
        <button type="button" onClick={onDelete} disabled={isLoading || isDeleting || !hasUser} className="mt-5 rounded-xl border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50">
          {isDeleting ? "Deleting account..." : "Delete my account"}
        </button>
      </section>
    </div>
  );
}
