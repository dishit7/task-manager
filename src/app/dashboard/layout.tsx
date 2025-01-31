import type { Metadata } from "next";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Dashboard | PlanWise",
  description: "Manage your tasks and projects effectively.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
