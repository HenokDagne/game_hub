"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
  { href: "/admin", label: "Overview cards" },
  { href: "/admin/users", label: "User management" },
  { href: "/admin/content", label: "Game/content management" },
  { href: "/admin/orders", label: "Orders/payments" },
  { href: "/admin/moderation", label: "Moderation" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminDashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="rounded border border-black/10 p-2">
      <div className="flex flex-wrap gap-2">
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              className={`rounded border px-3 py-1.5 text-sm transition ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-white text-black hover:bg-black/5"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
