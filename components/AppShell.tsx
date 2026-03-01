"use client";

import Sidebar from "@/components/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
  role: "USER" | "ADMIN" | null;
};

export default function AppShell({ children, role }: AppShellProps) {
  const sidebarRole = role ?? "USER";

  return (
    <div className="flex w-full">
      <Sidebar role={sidebarRole} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
