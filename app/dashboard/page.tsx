import { getSafeServerSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSafeServerSession();

  if (!session?.user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-4 px-6 py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Name: {session.user.name ?? "N/A"}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </main>
  );
}
