import Link from "next/link";

type SidebarProps = {
  role: "USER" | "ADMIN";
};

type SidebarItem = {
  href: string;
  label: string;
};

const userItems: SidebarItem[] = [
  { href: "/games", label: "Games" },
  { href: "/favorites", label: "Favorites" },
  { href: "/dashboard", label: "Dashboard" },
];

const adminItems: SidebarItem[] = [
  { href: "/games", label: "Games" },
  { href: "/favorites", label: "Favorites" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" },
];

export default function Sidebar({ role }: SidebarProps) {
  const items = role === "ADMIN" ? adminItems : userItems;

  return (
    <aside className="hidden h-[calc(100vh-73px)] w-72 shrink-0 overflow-y-auto border-r border-black/10 p-4 md:block">
      <p className="mb-3 text-xs font-semibold tracking-wide text-black/60">{role} MENU</p>
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
