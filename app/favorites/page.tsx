import FavoriteButton from "@/components/FavoriteButton";
import { prisma } from "@/lib/prisma";
import { getSafeServerSession } from "@/lib/session";

export default async function FavoritesPage() {
  const session = await getSafeServerSession();

  if (!session?.user?.id) {
    return null;
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-4xl space-y-4 px-6 py-8">
      <h1 className="text-3xl font-bold">My Favorites</h1>
      {!favorites.length ? <p>You have no saved favorites yet.</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {favorites.map((favorite) => (
          <article className="rounded border border-black/10 p-4" key={favorite.id}>
            <h2 className="font-semibold">{favorite.title}</h2>
            <p className="text-sm text-black/70">Game ID: {favorite.gameId}</p>
            <div className="pt-3">
              <FavoriteButton gameId={favorite.gameId} image={favorite.image} initialFavorite title={favorite.title} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
