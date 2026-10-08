import type { ReactNode } from "react";
import DashboardHeader from "./dashboardHeader";
import Sidebar from "./sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar />
      <div className="md:pl-64">
        <DashboardHeader />
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
