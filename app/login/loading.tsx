export default function LoginLoading() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-10">
      <div className="skeleton-block h-10 w-28 animate-pulse rounded" />
      <div className="space-y-3">
        <div className="skeleton-block h-10 w-full animate-pulse rounded" />
        <div className="skeleton-block h-10 w-full animate-pulse rounded" />
        <div className="skeleton-block h-10 w-full animate-pulse rounded" />
      </div>
      <div className="skeleton-block h-10 w-full animate-pulse rounded" />
      <div className="skeleton-block h-4 w-44 animate-pulse rounded" />
    </main>
  );
}
