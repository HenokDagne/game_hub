export default function GamesLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 h-10 w-48 animate-pulse rounded bg-black/10" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="h-64 animate-pulse rounded bg-black/10" key={index} />
        ))}
      </div>
    </main>
  );
}
