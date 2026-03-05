"use client";

import {
  Activity,
  ChartColumnBig,
  DollarSign,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

type MetricKey = "sales" | "revenue" | "newClients" | "activeUsers";

type MetricCard = {
  key: MetricKey;
  title: string;
  value: string;
  change: string;
  subtitle: string;
  trend: number[];
};

type TrafficPoint = {
  label: string;
  favorites: number;
  newUsers: number;
};

type CountryValue = {
  name: string;
  value: number;
};

type AdminAnalyticsOverviewProps = {
  periodLabel: string;
  metrics: MetricCard[];
  traffic: TrafficPoint[];
  countries: CountryValue[];
};

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const iconMap: Record<MetricKey, LucideIcon> = {
  sales: ChartColumnBig,
  revenue: DollarSign,
  newClients: UserPlus,
  activeUsers: Activity,
};

function getCssVar(name: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function getCountryFill(value: number, maxValue: number) {
  if (value <= 0 || maxValue <= 0) {
    return "var(--analytics-map-empty, color-mix(in srgb, var(--analytics-track) 72%, var(--surface)))";
  }

  const ratio = value / maxValue;

  if (ratio >= 0.8) {
    return "var(--analytics-map-5, color-mix(in srgb, var(--analytics-primary) 95%, var(--surface)))";
  }

  if (ratio >= 0.6) {
    return "var(--analytics-map-4, color-mix(in srgb, var(--analytics-primary) 78%, var(--surface)))";
  }

  if (ratio >= 0.4) {
    return "var(--analytics-map-3, color-mix(in srgb, var(--analytics-primary) 62%, var(--surface)))";
  }

  if (ratio >= 0.2) {
    return "var(--analytics-map-2, color-mix(in srgb, var(--analytics-primary) 46%, var(--surface)))";
  }

  return "var(--analytics-map-1, color-mix(in srgb, var(--analytics-primary) 30%, var(--surface)))";
}

export default function AdminAnalyticsOverview({ periodLabel, metrics, traffic, countries }: AdminAnalyticsOverviewProps) {
  const countryMap = new Map(countries.map((item) => [item.name.toLowerCase(), item.value]));
  const maxCountryValue = Math.max(...countries.map((item) => item.value), 1);

  const gridColor = getCssVar("--analytics-grid", "rgba(15, 23, 42, 0.12)");
  const primaryColor = getCssVar("--analytics-primary", "rgba(37, 99, 235, 0.85)");
  const tooltipBg = getCssVar("--surface", "#ffffff");
  const tooltipText = getCssVar("--foreground", "#111827");
  const trafficData = traffic.map((point) => ({ label: point.label, favorites: point.favorites }));

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Analytics</h2>

      <div className="grid gap-3 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = iconMap[metric.key];

          return (
            <article className="game-card-shadow rounded-lg border border-black/10 bg-white p-4" key={metric.key}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-black/60">{metric.title}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{metric.value}</p>
                  <p className="text-xs text-black/60">{periodLabel}</p>
                </div>
                <span className="analytics-primary-bg inline-flex h-8 w-8 items-center justify-center rounded-md text-white">
                  <Icon size={16} strokeWidth={2} />
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs font-medium text-black/70">{metric.change}</p>
                <p className="text-xs text-black/60">{metric.subtitle}</p>
              </div>

              <div className="mt-3 h-12">
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={metric.trend.map((value, index) => ({ name: index, value }))}>
                    <Line
                      dataKey="value"
                      dot={false}
                      isAnimationActive={false}
                      stroke={primaryColor}
                      strokeLinecap="round"
                      strokeWidth={2}
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="space-y-3 rounded-lg border border-black/10 bg-white p-4">
          <div>
            <h3 className="text-base font-semibold">Traffic summary</h3>
            <p className="text-sm text-black/70">Favorites per day</p>
          </div>

          <div className="h-64 rounded border border-black/10 p-3">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart barCategoryGap={10} data={trafficData}>
                <defs>
                  <linearGradient id="favoritesGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={primaryColor} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={primaryColor} stopOpacity={0.65} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="label" tickLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={32} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${gridColor}`,
                    borderRadius: 8,
                    color: tooltipText,
                  }}
                  cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                />
                <Bar dataKey="favorites" fill="url(#favoritesGradient)" maxBarSize={18} name="Favorites" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="space-y-3 rounded-lg border border-black/10 bg-white p-4">
          <div>
            <h3 className="text-base font-semibold">Locations</h3>
            <p className="text-sm text-black/70">User distribution by country</p>
          </div>

          <div className="rounded border border-black/10 p-3">
            <ComposableMap projection="geoEqualEarth" style={{ width: "100%", height: "260px" }}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = String(
                      geo.properties.name ?? geo.properties.NAME ?? geo.properties.ADMIN ?? "",
                    ).toLowerCase();
                    const value = countryMap.get(countryName) ?? 0;

                    return (
                      <Geography
                        geography={geo}
                        key={geo.rsmKey}
                        style={{
                          default: {
                            fill: getCountryFill(value, maxCountryValue),
                            outline: "none",
                            stroke: "var(--analytics-grid)",
                            strokeWidth: 0.5,
                          },
                          hover: {
                            fill: "var(--analytics-primary)",
                            outline: "none",
                            stroke: "var(--analytics-grid)",
                            strokeWidth: 0.5,
                          },
                          pressed: {
                            fill: "var(--analytics-primary)",
                            outline: "none",
                            stroke: "var(--analytics-grid)",
                            strokeWidth: 0.5,
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
        </section>
      </div>
    </section>
  );
}
