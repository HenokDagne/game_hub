import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold md:text-5xl">GameHub</h1>
      <p className="max-w-2xl text-lg text-black/70">
        Discover trending titles, search across genres and platforms, and save your favorites with secure authentication.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link className="rounded border border-black/20 bg-[var(--surface)] px-5 py-2 text-[var(--foreground)]" href="/games">
          Browse Games
        </Link>
        <Link className="rounded border border-black/20 px-5 py-2" href="/favorites">
          My Favorites
        </Link>
        <Link className="rounded border border-black/20 px-5 py-2" href="/dashboard">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
