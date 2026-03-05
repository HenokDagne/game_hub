import { prisma } from "@/lib/prisma";
import { getSafeServerSession } from "@/lib/session";

export default async function DashboardLibraryPage() {
  const session = await getSafeServerSession();

  if (!session?.user) {
    return null;
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true },
  });

  return (
    <>
      <h2 className="text-xl font-semibold">My library / owned games</h2>
      <p className="text-sm text-black/70">Purchased or claimed games with quick actions and last played.</p>
      <div className="space-y-2">
        {favorites.length ? (
          favorites.map((item) => (
            <div className="rounded border border-black/10 p-4" key={item.id}>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-black/70">Last played: {new Date(item.createdAt).toLocaleDateString()}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <span className="rounded border border-black/10 px-2 py-1">Install</span>
                <span className="rounded border border-black/10 px-2 py-1">Play</span>
                <span className="rounded border border-black/10 px-2 py-1">Open</span>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded border border-black/10 p-4 text-sm text-black/70">No owned games yet.</p>
        )}
      </div>
    </>
  );
}
