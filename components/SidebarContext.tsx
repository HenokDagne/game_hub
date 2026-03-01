"use client";

import { createContext, useContext, useMemo, useState } from "react";

type SidebarContextValue = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const value = useMemo(
    () => ({
      isSidebarOpen,
      toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
    }),
    [isSidebarOpen],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }

  return context;
}
