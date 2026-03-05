import type { ReactNode } from "react";

type AnalyticsMetricCardProps = {
  title: string;
  value: string;
  period?: string;
  change?: string;
  subtitle?: string;
  footerPrimary?: string;
  footerSecondary?: string;
  miniChart?: ReactNode;
};

export default function AnalyticsMetricCard({
  title,
  value,
  period,
  change,
  subtitle,
  footerPrimary,
  footerSecondary,
  miniChart,
}: AnalyticsMetricCardProps) {
  return (
    <article className="game-card-shadow rounded-lg border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-black/60">{title}</p>
        {period ? <span className="text-xs text-black/60">{period}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {subtitle ? <p className="text-sm text-black/70">{subtitle}</p> : null}
        {change ? <p className="text-xs font-medium text-black/60">{change}</p> : null}
      </div>
      {miniChart ? <div className="mt-3">{miniChart}</div> : null}
      {footerPrimary || footerSecondary ? (
        <div className="mt-3 space-y-0.5 text-xs text-black/70">
          {footerPrimary ? <p>{footerPrimary}</p> : null}
          {footerSecondary ? <p>{footerSecondary}</p> : null}
        </div>
      ) : null}
    </article>
  );
}
