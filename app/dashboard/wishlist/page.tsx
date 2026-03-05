import { prisma } from "@/lib/prisma";
import { getSafeServerSession } from "@/lib/session";

export default async function DashboardWishlistPage() {
  const session = await getSafeServerSession();

  if (!session?.user) {
    return null;
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true },
  });

  return (
    <>
      <h2 className="text-xl font-semibold">Wishlist</h2>
      <p className="text-sm text-black/70">Saved games with price and drop indicators.</p>
      <div className="space-y-2">
        {favorites.length ? (
          favorites.map((item) => (
            <div className="rounded border border-black/10 p-4" key={item.id}>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-black/70">Price: N/A</p>
              <p className="text-sm text-black/70">Drop indicator: Not tracked</p>
            </div>
          ))
        ) : (
          <p className="rounded border border-black/10 p-4 text-sm text-black/70">No wishlist items yet.</p>
        )}
      </div>
    </>
  );
}
