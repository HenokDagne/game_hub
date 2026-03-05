export default function GamesLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="skeleton-block mb-6 h-10 w-48 animate-pulse rounded" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article className="game-card-shadow overflow-hidden rounded border border-black/10" key={index}>
            <div className="skeleton-block h-44 w-full animate-pulse" />
            <div className="space-y-2 p-4">
              <div className="skeleton-block h-6 w-2/3 animate-pulse rounded" />
              <div className="skeleton-block h-4 w-3/4 animate-pulse rounded" />
              <div className="skeleton-block h-4 w-full animate-pulse rounded" />
              <div className="skeleton-block h-4 w-5/6 animate-pulse rounded" />
              <div className="pt-2">
                <div className="skeleton-block h-9 w-28 animate-pulse rounded" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
