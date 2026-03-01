import { prisma } from "@/lib/prisma";
import { getSafeServerSession } from "@/lib/session";

export default async function AdminPage() {
  const session = await getSafeServerSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 px-6 py-8">
      <h1 className="text-3xl font-bold">Admin</h1>
      <div className="space-y-2">
        {users.map((user) => (
          <div className="rounded border border-black/10 p-4" key={user.id}>
            <p className="font-semibold">{user.name ?? "No name"}</p>
            <p className="text-sm">{user.email}</p>
            <p className="text-sm text-black/70">Role: {user.role}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
