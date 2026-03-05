type LinePoint = {
  label: string;
  value: number;
};

type AnalyticsLineChartProps = {
  points: LinePoint[];
};

function buildPolyline(points: LinePoint[]) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const minValue = Math.min(...points.map((point) => point.value), 0);
  const range = Math.max(maxValue - minValue, 1);

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const y = 100 - ((point.value - minValue) / range) * 100;

      return `${x},${y}`;
    })
    .join(" ");
}

export default function AnalyticsLineChart({ points }: AnalyticsLineChartProps) {
  const polyline = buildPolyline(points);

  return (
    <div className="space-y-3">
      <div className="rounded border border-black/10 p-3">
        <svg aria-label="line chart" className="h-36 w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline
            fill="none"
            points={polyline}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="grid grid-cols-5 gap-2 text-xs text-black/70">
        {points.map((point) => (
          <div className="rounded border border-black/10 px-2 py-1 text-center" key={point.label}>
            <p>{point.label}</p>
            <p className="font-semibold text-black">{point.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
