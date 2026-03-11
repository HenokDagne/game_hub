import Link from "next/link";

type SidebarProps = {
  role: "USER" | "ADMIN" | null;
};

type SidebarItem = {
  href: string;
  label: string;
  requiresAuth?: boolean;
};

const userItems: SidebarItem[] = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/favorites", label: "Favorites" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/library", label: "Library", requiresAuth: true },
  { href: "/dashboard/wishlist", label: "Wishlist", requiresAuth: true },
  { href: "/dashboard/notifications", label: "Notifications", requiresAuth: true },
  { href: "/dashboard/profile", label: "Profile Settings", requiresAuth: true },
];

const adminItems: SidebarItem[] = [
  { href: "/admin", label: "Admin" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/users", label: "User Management" },
  { href: "/admin/content", label: "Content Management" },
  { href: "/admin/orders", label: "Orders and Payments" },
  { href: "/admin/moderation", label: "Moderation" },
  { href: "/dashboard/security", label: "System Settings" },
  { href: "/dashboard", label: "Back to User Dashboard" },
];

export default function Sidebar({ role }: SidebarProps) {
  const isAuthenticated = role !== null;
  const items = role === "ADMIN" ? adminItems : userItems.filter((item) => !item.requiresAuth || isAuthenticated);
  const menuLabel = role === "ADMIN" ? "ADMIN" : role === "USER" ? "USER" : "GUEST";

  return (
    <aside className="sidebar-right-border hidden h-full w-72 shrink-0 overflow-hidden p-4 md:block">
      <p className="mb-3 text-xs font-semibold tracking-wide text-black/60">{menuLabel} MENU</p>
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <Link className="rounded border border-black/10 px-3 py-2 text-sm hover:bg-black/5" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
