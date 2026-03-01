"use client";

import { useSidebar } from "@/components/SidebarContext";

export default function SidebarToggleButton() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <button
      aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
      title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
      className="rounded border border-black/20 px-3 py-1 text-sm"
      onClick={toggleSidebar}
      type="button"
    >
      <span aria-hidden="true">{isSidebarOpen ? "✕" : "☰"}</span>
    </button>
  );
}
