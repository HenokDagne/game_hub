export default function HomeLoading() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="skeleton-block h-12 w-56 animate-pulse rounded" />
      <div className="space-y-2">
        <div className="skeleton-block h-5 w-[36rem] max-w-full animate-pulse rounded" />
        <div className="skeleton-block h-5 w-[30rem] max-w-full animate-pulse rounded" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="skeleton-block h-10 w-32 animate-pulse rounded" />
        <div className="skeleton-block h-10 w-32 animate-pulse rounded" />
        <div className="skeleton-block h-10 w-32 animate-pulse rounded" />
      </div>
    </main>
  );
}
