type TransactionPasswordDialogProps = {
  password: string;
  error: string;
  isSubmitting: boolean;
  transactionLabel: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function TransactionPasswordDialog({
  password,
  error,
  isSubmitting,
  transactionLabel,
  onChange,
  onSubmit,
  onClose,
}: TransactionPasswordDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-password-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="transaction-password-title" className="text-xl font-semibold text-slate-950">
              Confirm {transactionLabel}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your password to authorize this transaction.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close transaction password dialog"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-2xl leading-none text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              required
              autoFocus
              type="password"
              value={password}
              onChange={(event) => onChange(event.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Authorizing..." : "Confirm transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
