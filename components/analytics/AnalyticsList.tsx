type AnalyticsListProps = {
  items: string[];
};

export default function AnalyticsList({ items }: AnalyticsListProps) {
  return (
    <ul className="space-y-2 text-sm text-black/70">
      {items.map((item) => (
        <li className="rounded border border-black/10 px-3 py-2" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
