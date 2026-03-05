export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-4 px-6 py-8">
      <div className="skeleton-block h-10 w-40 animate-pulse rounded" />
      <div className="space-y-3">
        <div className="skeleton-block h-6 w-64 animate-pulse rounded" />
        <div className="skeleton-block h-6 w-72 animate-pulse rounded" />
        <div className="skeleton-block h-6 w-48 animate-pulse rounded" />
      </div>
    </main>
  );
}
