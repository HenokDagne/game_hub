import Image from "next/image";
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
    <main className="mx-auto w-full max-w-7xl space-y-4 px-6 py-8">
      <h1 className="text-3xl font-bold">My Favorites</h1>
      {!favorites.length ? <p>You have no saved favorites yet.</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {favorites.map((favorite) => (
          <article className="card-hover-blur game-card-shadow overflow-hidden rounded border border-black/10" key={favorite.id}>
            <div className="relative h-56 w-full bg-black/5">
              {favorite.image ? (
                <Image alt={favorite.title} className="object-cover" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" src={favorite.image} />
              ) : null}
            </div>
            <div className="space-y-3 p-4">
              <h2 className="font-semibold">{favorite.title}</h2>
            <div className="pt-3">
              <FavoriteButton gameId={favorite.gameId} image={favorite.image} initialFavorite title={favorite.title} />
            </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
