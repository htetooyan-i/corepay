import { PasswordDialog, ProfilePasswordDialog } from "./passwordDialogs";
import { ProfileField, ProfileValue } from "./profileField";
import type { PasswordForm, ProfileForm } from "./settingsTypes";
import type { User } from "@/types/User";

type ProfileSectionProps = {
  form: ProfileForm;
  user: User | null;
  error: string;
  message: string;
  isLoading: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isPasswordSaving: boolean;
  isPasswordModalOpen: boolean;
  isProfilePasswordModalOpen: boolean;
  currentPassword: string;
  passwordForm: PasswordForm;
  onFieldChange: (field: keyof ProfileForm, value: string) => void;
  onPasswordFieldChange: (field: keyof PasswordForm, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onProfileSave: (event: React.FormEvent<HTMLFormElement>) => void;
  onPasswordSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onEdit: () => void;
  onCancel: () => void;
  onOpenPassword: () => void;
  onClosePassword: () => void;
  onCloseProfilePassword: () => void;
  onCurrentPasswordChange: (value: string) => void;
};

export function ProfileSection({
  form,
  user,
  error,
  message,
  isLoading,
  isEditing,
  isSaving,
  isPasswordSaving,
  isPasswordModalOpen,
  isProfilePasswordModalOpen,
  currentPassword,
  passwordForm,
  onFieldChange,
  onPasswordFieldChange,
  onSubmit,
  onProfileSave,
  onPasswordSubmit,
  onEdit,
  onCancel,
  onOpenPassword,
  onClosePassword,
  onCloseProfilePassword,
  onCurrentPasswordChange,
}: ProfileSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">Personal information</p>
          <p className="mt-1 text-sm text-slate-500">
            This information is used to identify you on your account.
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-lg font-semibold text-cyan-700">
          {form.firstName.charAt(0).toUpperCase() || "P"}
        </div>
      </div>

      {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

      {isEditing ? (
        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="First name" value={form.firstName} onChange={(value) => onFieldChange("firstName", value)} disabled={isLoading || isSaving} autoComplete="given-name" />
            <ProfileField label="Last name" value={form.lastName} onChange={(value) => onFieldChange("lastName", value)} disabled={isLoading || isSaving} autoComplete="family-name" />
          </div>
          <ProfileField label="Email address" type="email" value={form.email} onChange={(value) => onFieldChange("email", value)} disabled={isLoading || isSaving} autoComplete="email" />
          <ProfileField label="Phone number" type="tel" value={form.phoneNumber} onChange={(value) => onFieldChange("phoneNumber", value)} disabled={isLoading || isSaving} autoComplete="tel" />
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={onCancel} disabled={isSaving} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || isSaving || !user} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8">
          <dl className="grid gap-5 sm:grid-cols-2">
            <ProfileValue label="First name" value={isLoading ? "Loading..." : form.firstName} />
            <ProfileValue label="Last name" value={isLoading ? "Loading..." : form.lastName} />
            <ProfileValue label="Email address" value={isLoading ? "Loading..." : form.email} />
            <ProfileValue label="Phone number" value={isLoading ? "Loading..." : form.phoneNumber} />
          </dl>
          <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" onClick={onEdit} disabled={isLoading || !user} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                Edit personal information
              </button>
              <button type="button" onClick={onOpenPassword} disabled={isLoading || !user} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                Change password
              </button>
            </div>
          </div>
        </div>
      )}

      {isPasswordModalOpen && <PasswordDialog passwordForm={passwordForm} error={error} isSaving={isPasswordSaving} onChange={onPasswordFieldChange} onSubmit={onPasswordSubmit} onClose={onClosePassword} />}
      {isProfilePasswordModalOpen && <ProfilePasswordDialog currentPassword={currentPassword} error={error} isSaving={isSaving} onChange={onCurrentPasswordChange} onSubmit={onProfileSave} onClose={onCloseProfilePassword} />}
    </section>
  );
}
