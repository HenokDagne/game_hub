export default function GameDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="space-y-6">
          <div className="skeleton-block h-10 w-2/3 animate-pulse rounded" />
          <div className="skeleton-block h-64 w-full animate-pulse rounded border border-black/10 sm:h-80" />
          <div className="skeleton-block h-5 w-52 animate-pulse rounded" />
          <div className="skeleton-block h-5 w-44 animate-pulse rounded" />
          <div className="skeleton-block h-10 w-28 animate-pulse rounded" />
          <div className="space-y-2">
            <div className="skeleton-block h-5 w-full animate-pulse rounded" />
            <div className="skeleton-block h-5 w-full animate-pulse rounded" />
            <div className="skeleton-block h-5 w-11/12 animate-pulse rounded" />
            <div className="skeleton-block h-5 w-10/12 animate-pulse rounded" />
          </div>
        </section>

        <aside className="sidebar-right-border space-y-3 border border-black/10 p-4 lg:h-fit lg:border-l lg:border-r-0">
          <div className="skeleton-block h-7 w-36 animate-pulse rounded" />
          <div className="skeleton-block h-5 w-28 animate-pulse rounded" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="rounded border border-black/10 p-2" key={index}>
                <div className="flex items-center gap-3">
                  <div className="skeleton-block h-14 w-20 animate-pulse rounded" />
                  <div className="w-full space-y-2">
                    <div className="skeleton-block h-4 w-11/12 animate-pulse rounded" />
                    <div className="skeleton-block h-3 w-8/12 animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
