type GroupedPoint = {
  label: string;
  primary: number;
  secondary: number;
};

type AnalyticsGroupedBarsProps = {
  points: GroupedPoint[];
};

export default function AnalyticsGroupedBars({ points }: AnalyticsGroupedBarsProps) {
  const maxValue = Math.max(...points.map((point) => Math.max(point.primary, point.secondary)), 1);

  return (
    <div className="space-y-3">
      <div className="grid h-48 grid-flow-col items-end gap-1 rounded border border-black/10 bg-white p-3">
        {points.map((point) => (
          <div className="flex h-full items-end justify-center gap-0.5" key={point.label}>
            <div
              className="analytics-secondary-bg w-2 rounded-t"
              style={{ height: `${(point.secondary / maxValue) * 100}%` }}
              title={`${point.label} users: ${point.secondary}`}
            />
            <div
              className="analytics-primary-bg w-2 rounded-t"
              style={{ height: `${(point.primary / maxValue) * 100}%` }}
              title={`${point.label} favorites: ${point.primary}`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-black/70">
        <span className="inline-flex items-center gap-2">
          <span className="analytics-primary-bg h-2.5 w-2.5 rounded-sm" /> Favorites
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="analytics-secondary-bg h-2.5 w-2.5 rounded-sm" /> New users
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-black/60 sm:grid-cols-14">
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}
