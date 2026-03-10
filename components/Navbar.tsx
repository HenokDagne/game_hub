import Link from "next/link";
import AuthButtons from "@/components/AuthButtons";
import SidebarToggleButton from "@/components/SidebarToggleButton";
import ThemeToggle from "@/components/ThemeToggle";
import UndoNavigationButton from "@/components/UndoNavigationButton";
import { getSafeServerSession } from "@/lib/session";

export default async function Navbar() {
  const session = await getSafeServerSession();

  return (
    <header className="relative shrink-0 border-b border-black/10">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-4">
        <UndoNavigationButton />
      </div>
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
          {session?.user.role === "ADMIN" ? <Link href="/admin/analytics">Analytics</Link> : null}
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
