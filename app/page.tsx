import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden">
      <div className="hero-bg-rotator" aria-hidden="true">
        <div className="hero-bg hero-bg-1" />
        <div className="hero-bg hero-bg-2" />
        <div className="hero-bg hero-bg-3" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(148,163,184,0.22),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(56,189,248,0.18),transparent_35%)]" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl flex-col items-center justify-center gap-7 px-6 py-16 text-center text-white">
        <p className="rounded-full border border-white/35 bg-white/10 px-4 py-1 text-xs tracking-[0.22em] uppercase backdrop-blur-sm">
          Explore. Collect. Dominate.
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          Build your next legendary library on GameHub
        </h1>

        <p className="max-w-2xl text-base text-white/85 md:text-lg">
          Discover trending titles, filter by genre and platform, track your favorites, and keep your gaming world in one place.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="rounded border border-white/40 bg-white/15 px-5 py-2.5 font-medium text-white backdrop-blur-sm transition hover:bg-white/25"
            href="/games"
          >
            Browse Games
          </Link>
          <Link
            className="rounded border border-white/30 px-5 py-2.5 font-medium text-white transition hover:bg-white/12"
            href="/favorites"
          >
            My Favorites
          </Link>
          <Link
            className="rounded border border-white/30 px-5 py-2.5 font-medium text-white transition hover:bg-white/12"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
