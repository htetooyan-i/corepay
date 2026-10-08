import SettingsForm from "./settingsForm";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Preferences
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-3 text-slate-600">
          Keep your personal information up to date and manage your account.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
