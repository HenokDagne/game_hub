export default function FavoritesLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-6 py-8">
      <div className="skeleton-block h-10 w-52 animate-pulse rounded" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article className="game-card-shadow overflow-hidden rounded border border-black/10" key={index}>
            <div className="skeleton-block h-56 w-full animate-pulse" />
            <div className="space-y-3 p-4">
              <div className="skeleton-block h-6 w-2/3 animate-pulse rounded" />
              <div className="pt-1">
                <div className="skeleton-block h-9 w-28 animate-pulse rounded" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
