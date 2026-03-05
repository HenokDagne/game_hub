import type { ReactNode } from "react";
import UserDashboardNav from "@/components/UserDashboardNav";
import { getSafeServerSession } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSafeServerSession();

  if (!session?.user) {
    return null;
  }

  return (
    <main className="w-full space-y-4 px-6 py-8">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <p className="text-sm text-black/70">Account and player activity overview.</p>
      <UserDashboardNav />
      <section className="w-full space-y-4">{children}</section>
    </main>
  );
}
