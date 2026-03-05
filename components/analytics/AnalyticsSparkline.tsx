type SparkPoint = {
  label: string;
  value: number;
};

type AnalyticsSparklineProps = {
  points: SparkPoint[];
  variant?: "primary" | "secondary";
};

function buildPolyline(points: SparkPoint[]) {
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

export default function AnalyticsSparkline({ points, variant = "primary" }: AnalyticsSparklineProps) {
  if (!points.length) {
    return <div className="h-8 rounded bg-black/5" />;
  }

  const polyline = buildPolyline(points);
  const colorClass = variant === "secondary" ? "analytics-secondary" : "analytics-primary";

  return (
    <svg
      aria-label="sparkline"
      className={`h-8 w-full ${colorClass}`}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <polyline
        fill="none"
        points={polyline}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
    </svg>
  );
}
