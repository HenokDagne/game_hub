export default function RegisterLoading() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-10">
      <div className="skeleton-block h-10 w-36 animate-pulse rounded" />
      <div className="space-y-3">
        <div className="skeleton-block h-10 w-full animate-pulse rounded" />
        <div className="skeleton-block h-10 w-full animate-pulse rounded" />
        <div className="skeleton-block h-10 w-full animate-pulse rounded" />
        <div className="skeleton-block h-10 w-full animate-pulse rounded" />
      </div>
      <div className="skeleton-block h-4 w-56 animate-pulse rounded" />
    </main>
  );
}
