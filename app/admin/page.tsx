import { prisma } from "@/lib/prisma";
import { searchGames } from "@/lib/rawg";

export default async function AdminPage() {
  const [totalUsers, totalGames, pendingModeration] = await Promise.all([
    prisma.user.count(),
    searchGames({ page: "1", page_size: "1" })
      .then((response) => response.count)
      .catch(() => 0),
    Promise.resolve(0),
  ]);

  const totalOrdersOrSubscriptions = 0;
  const revenue = 0;

  const cards = [
    {
      title: "Total users",
      value: totalUsers.toLocaleString(),
      subtitle: "Registered accounts",
    },
    {
      title: "Total games",
      value: totalGames.toLocaleString(),
      subtitle: "From game catalog",
    },
    {
      title: "Total orders/subscriptions",
      value: totalOrdersOrSubscriptions.toLocaleString(),
      subtitle: "Billing module not enabled",
    },
    {
      title: "Revenue",
      value: `$${revenue.toLocaleString()}`,
      subtitle: "Not applicable yet",
    },
    {
      title: "Pending reports/moderation",
      value: pendingModeration.toLocaleString(),
      subtitle: "Moderation queue not enabled",
    },
  ];

  return (
    <>
      <h2 className="text-xl font-semibold">Overview cards</h2>
      <p className="text-sm text-black/70">High-level platform metrics for administrators.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            className="rounded-lg border border-black/10 bg-black/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-black/20"
            key={card.title}
          >
            <p className="text-sm font-medium text-black/70">{card.title}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight">{card.value}</p>
            <p className="mt-2 text-xs text-black/60">{card.subtitle}</p>
          </article>
        ))}
      </div>
      <div className="rounded-lg border border-black/10 bg-white p-4 text-sm text-black/70">
        Orders, subscriptions, revenue, and moderation metrics are shown as placeholders until those
        backend modules are added.
      </div>
    </>
  );
}
