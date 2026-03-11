"use client";

import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/components/SidebarContext";

type AppShellProps = {
  children: React.ReactNode;
  role: "USER" | "ADMIN" | null;
};

export default function AppShell({ children, role }: AppShellProps) {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {isSidebarOpen ? <Sidebar role={role} /> : null}
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
