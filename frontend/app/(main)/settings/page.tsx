export default function SettingsPage() {
  return <PageIntro title="Settings" description="Manage your personal profile, security, and notification preferences." />;
}

function PageIntro({ title, description }: { title: string; description: string }) {
  return <div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Preferences</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-3 text-slate-600">{description}</p></div>;
}
