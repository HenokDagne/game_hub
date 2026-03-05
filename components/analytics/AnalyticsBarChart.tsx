type BarItem = {
  label: string;
  value: number;
};

type AnalyticsBarChartProps = {
  items: BarItem[];
};

export default function AnalyticsBarChart({ items }: AnalyticsBarChartProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const width = (item.value / maxValue) * 100;

        return (
          <div className="space-y-1" key={item.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/70">{item.label}</span>
              <span className="font-medium">{item.value.toLocaleString()}</span>
            </div>
            <div className="h-2.5 rounded-full bg-black/10">
              <div className="h-2.5 rounded-full bg-black/70" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
