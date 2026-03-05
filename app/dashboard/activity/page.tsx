import { prisma } from "@/lib/prisma";
import { getSafeServerSession } from "@/lib/session";

export default async function DashboardActivityPage() {
  const session = await getSafeServerSession();

  if (!session?.user) {
    return null;
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, createdAt: true },
  });

  return (
    <>
      <h2 className="text-xl font-semibold">Recent activity</h2>
      <p className="text-sm text-black/70">Recently played or viewed games and latest actions.</p>
      <div className="space-y-2">
        {favorites.length ? (
          favorites.map((item) => (
            <div className="rounded border border-black/10 p-4" key={item.id}>
              <p className="font-semibold">Viewed: {item.title}</p>
              <p className="text-sm text-black/70">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="rounded border border-black/10 p-4 text-sm text-black/70">No recent activity.</p>
        )}
      </div>
    </>
  );
}
