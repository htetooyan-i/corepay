import { ProfileField } from "./profileField";
import type { PasswordForm } from "./settingsTypes";

type PasswordDialogProps = {
  passwordForm: PasswordForm;
  error: string;
  isSaving: boolean;
  onChange: (field: keyof PasswordForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function PasswordDialog({
  passwordForm,
  error,
  isSaving,
  onChange,
  onSubmit,
  onClose,
}: PasswordDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <DialogHeader
          titleId="change-password-title"
          title="Change password"
          description="Enter your current password and choose a new one."
          label="Close change password dialog"
          onClose={onClose}
          disabled={isSaving}
        />
        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <ProfileField label="Current password" type="password" value={passwordForm.currentPassword} onChange={(value) => onChange("currentPassword", value)} disabled={isSaving} autoComplete="current-password" />
          <ProfileField label="New password" type="password" value={passwordForm.newPassword} onChange={(value) => onChange("newPassword", value)} disabled={isSaving} autoComplete="new-password" />
          <ProfileField label="Confirm new password" type="password" value={passwordForm.confirmPassword} onChange={(value) => onChange("confirmPassword", value)} disabled={isSaving} autoComplete="new-password" />
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? "Updating password..." : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type ProfilePasswordDialogProps = {
  currentPassword: string;
  error: string;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function ProfilePasswordDialog({
  currentPassword,
  error,
  isSaving,
  onChange,
  onSubmit,
  onClose,
}: ProfilePasswordDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="confirm-profile-password-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <DialogHeader
          titleId="confirm-profile-password-title"
          title="Confirm your password"
          description="Enter your current password to save these changes."
          label="Close password confirmation dialog"
          onClose={onClose}
          disabled={isSaving}
        />
        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <ProfileField label="Current password" type="password" value={currentPassword} onChange={onChange} disabled={isSaving} autoComplete="current-password" />
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? "Saving changes..." : "Confirm and save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type DeleteAccountDialogProps = {
  currentPassword: string;
  error: string;
  isDeleting: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function DeleteAccountDialog({
  currentPassword,
  error,
  isDeleting,
  onChange,
  onSubmit,
  onClose,
}: DeleteAccountDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="delete-account-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <DialogHeader
          titleId="delete-account-title"
          title="Delete your account?"
          description="This permanently deletes your account. Enter your password to continue."
          label="Close delete account dialog"
          onClose={onClose}
          disabled={isDeleting}
        />
        <form className="mt-6 space-y-5" onSubmit={onSubmit}>
          <ProfileField label="Current password" type="password" value={currentPassword} onChange={onChange} disabled={isDeleting} autoComplete="current-password" />
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={onClose} disabled={isDeleting} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isDeleting} className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50">
              {isDeleting ? "Deleting account..." : "Delete account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DialogHeader({
  title,
  titleId,
  description,
  label,
  onClose,
  disabled,
}: {
  title: string;
  titleId: string;
  description: string;
  label: string;
  onClose: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 id={titleId} className="text-xl font-semibold text-slate-950">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <button type="button" aria-label={label} onClick={onClose} disabled={disabled} className="text-2xl leading-none text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
        ×
      </button>
    </div>
  );
}
