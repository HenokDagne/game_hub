import AdminAnalyticsOverview from "@/components/analytics/AdminAnalyticsOverview";
import { prisma } from "@/lib/prisma";
import { searchGames } from "@/lib/rawg";

type DailyPoint = {
  label: string;
  dateKey: string;
};

function getDateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function percentChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? "0%" : "+100%";
  }

  const value = ((current - previous) / previous) * 100;
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

function formatMetric(value: number, compact = false) {
  if (compact) {
    return value.toLocaleString(undefined, { notation: "compact" });
  }

  return value.toLocaleString();
}

function getLastNDays(days: number) {
  const now = new Date();
  const output: DailyPoint[] = [];

  for (let index = days - 1; index >= 0; index -= 1) {
    const day = new Date(now);
    day.setDate(now.getDate() - index);
    output.push({
      label: day.toLocaleDateString(undefined, { day: "2-digit", month: "short" }),
      dateKey: getDateKey(day),
    });
  }

  return output;
}

function countryFromEmail(email: string) {
  const lower = email.toLowerCase();
  const tld = lower.split(".").pop() ?? "";

  const tldCountryMap: Record<string, string> = {
    us: "United States of America",
    ca: "Canada",
    mx: "Mexico",
    br: "Brazil",
    ar: "Argentina",
    cl: "Chile",
    co: "Colombia",
    pe: "Peru",
    uk: "United Kingdom",
    de: "Germany",
    fr: "France",
    it: "Italy",
    es: "Spain",
    nl: "Netherlands",
    se: "Sweden",
    no: "Norway",
    dk: "Denmark",
    fi: "Finland",
    za: "South Africa",
    ae: "United Arab Emirates",
    sa: "Saudi Arabia",
    tr: "Turkey",
    cn: "China",
    jp: "Japan",
    kr: "South Korea",
    in: "India",
    id: "Indonesia",
    sg: "Singapore",
    au: "Australia",
    nz: "New Zealand",
    ph: "Philippines",
    th: "Thailand",
    vn: "Vietnam",
    my: "Malaysia",
  };

  return tldCountryMap[tld] ?? "United States of America";
}

export default async function AdminAnalyticsPage() {
  const [users, favorites, gameCatalog] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.favorite.findMany({
      select: {
        userId: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    searchGames({ page: "1", page_size: "1" }).catch(() => ({ count: 0 })),
  ]);

  const totalUsers = users.length;
  const totalFavorites = favorites.length;
  const totalGames = gameCatalog.count;

  const sevenDayWindow = getLastNDays(14);
  const last7Keys = new Set(sevenDayWindow.slice(-7).map((item) => item.dateKey));
  const previous7Keys = new Set(sevenDayWindow.slice(0, 7).map((item) => item.dateKey));

  const favoritesByDay = favorites.reduce<Record<string, number>>((accumulator, item) => {
    const key = getDateKey(new Date(item.createdAt));
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  const usersByDay = users.reduce<Record<string, number>>((accumulator, item) => {
    const key = getDateKey(new Date(item.createdAt));
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  const groupedTraffic = sevenDayWindow.map((day) => ({
    label: day.label,
    favorites: favoritesByDay[day.dateKey] ?? 0,
    newUsers: usersByDay[day.dateKey] ?? 0,
  }));

  const favoritesLast7 = favorites
    .filter((item) => last7Keys.has(getDateKey(new Date(item.createdAt))))
    .length;
  const favoritesPrev7 = favorites
    .filter((item) => previous7Keys.has(getDateKey(new Date(item.createdAt))))
    .length;

  const usersLast7 = users
    .filter((item) => last7Keys.has(getDateKey(new Date(item.createdAt))))
    .length;
  const usersPrev7 = users
    .filter((item) => previous7Keys.has(getDateKey(new Date(item.createdAt))))
    .length;

  const activeUsersLast7 = new Set(
    favorites
      .filter((item) => last7Keys.has(getDateKey(new Date(item.createdAt))))
      .map((item) => item.userId),
  ).size;
  const activeUsersPrev7 = new Set(
    favorites
      .filter((item) => previous7Keys.has(getDateKey(new Date(item.createdAt))))
      .map((item) => item.userId),
  ).size;

  const conversionRate = totalUsers ? (activeUsersLast7 / totalUsers) * 100 : 0;

  const estimatedRevenue = favoritesLast7 * 12 + activeUsersLast7 * 3;
  const estimatedRevenuePrev = favoritesPrev7 * 12 + activeUsersPrev7 * 3;

  const countriesMap = users.reduce<Record<string, number>>((accumulator, user) => {
    const country = countryFromEmail(user.email);
    accumulator[country] = (accumulator[country] ?? 0) + 1;
    return accumulator;
  }, {});

  const countries = Object.entries(countriesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([name, value]) => ({ name, value }));

  const favoritesSeries = groupedTraffic.slice(-7).map((point) => point.favorites);
  const usersSeries = groupedTraffic.slice(-7).map((point) => point.newUsers);
  const combinedSeries = groupedTraffic.slice(-7).map((point) => point.favorites + point.newUsers);

  const metrics = [
    {
      key: "sales" as const,
      title: "Sales",
      value: `${conversionRate.toFixed(0)}%`,
      change: `${percentChange(activeUsersLast7, activeUsersPrev7)} ↗`,
      subtitle: "Conversion rate",
      trend: combinedSeries,
    },
    {
      key: "revenue" as const,
      title: "Revenue",
      value: `$${formatMetric(estimatedRevenue)}`,
      change: `${percentChange(estimatedRevenue, estimatedRevenuePrev)} ↗`,
      subtitle: `${formatMetric(totalFavorites)} total favorites`,
      trend: favoritesSeries,
    },
    {
      key: "newClients" as const,
      title: "New Clients",
      value: formatMetric(usersLast7, true),
      change: `${percentChange(usersLast7, usersPrev7)} ↗`,
      subtitle: `${formatMetric(totalGames)} games in catalog`,
      trend: usersSeries,
    },
    {
      key: "activeUsers" as const,
      title: "Active Users",
      value: formatMetric(activeUsersLast7, true),
      change: `${percentChange(activeUsersLast7, activeUsersPrev7)} ↗`,
      subtitle: `${formatMetric(totalUsers)} registered users`,
      trend: combinedSeries,
    },
  ];

  return <AdminAnalyticsOverview countries={countries} metrics={metrics} periodLabel="Last 7 days" traffic={groupedTraffic} />;
}
