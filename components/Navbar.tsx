import Link from "next/link";
import AuthButtons from "@/components/AuthButtons";
import SidebarToggleButton from "@/components/SidebarToggleButton";
import ThemeToggle from "@/components/ThemeToggle";
import { getSafeServerSession } from "@/lib/session";

export default async function Navbar() {
  const session = await getSafeServerSession();

  return (
    <header className="shrink-0 border-b border-black/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <SidebarToggleButton />
          <Link className="text-xl font-bold" href="/">
            GameHub
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/games">Games</Link>
          <Link href="/favorites">Favorites</Link>
          <Link href="/dashboard">Dashboard</Link>
          {session?.user.role === "ADMIN" ? <Link href="/admin">Admin</Link> : null}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthButtons isAuthenticated={Boolean(session?.user)} />
        </div>
      </nav>
    </header>
  );
}
