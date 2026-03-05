"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const userNavItems = [
  { href: "/dashboard", label: "Profile summary" },
  { href: "/dashboard/profile", label: "Edit profile" },
  { href: "/dashboard/library", label: "My library" },
  { href: "/dashboard/wishlist", label: "Wishlist" },
  { href: "/dashboard/activity", label: "Recent activity" },
  { href: "/dashboard/billing", label: "Orders / billing" },
  { href: "/dashboard/downloads", label: "Downloads / updates" },
  { href: "/dashboard/achievements", label: "Achievements / progress" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/security", label: "Security / settings" },
];

export default function UserDashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="User dashboard sections" className="rounded border border-black/10 p-2">
      <div className="flex flex-wrap gap-2">
        {userNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

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
