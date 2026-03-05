import type { ReactNode } from "react";
import AdminDashboardNav from "@/components/AdminDashboardNav";
import { getSafeServerSession } from "@/lib/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSafeServerSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-6 py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-sm text-black/70">
        Platform management area for admin tasks only.
      </p>
      <AdminDashboardNav />
      <section className="space-y-4">{children}</section>
    </main>
  );
}
