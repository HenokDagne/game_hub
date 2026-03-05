export default function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 px-6 py-8">
      <div className="skeleton-block h-10 w-28 animate-pulse rounded" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="rounded border border-black/10 p-4" key={index}>
            <div className="space-y-2">
              <div className="skeleton-block h-5 w-40 animate-pulse rounded" />
              <div className="skeleton-block h-4 w-56 animate-pulse rounded" />
              <div className="skeleton-block h-4 w-24 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
