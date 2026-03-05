type LocationPoint = {
  label: string;
  value: number;
};

type AnalyticsLocationPanelProps = {
  regions: LocationPoint[];
};

export default function AnalyticsLocationPanel({ regions }: AnalyticsLocationPanelProps) {
  const maxValue = Math.max(...regions.map((region) => region.value), 1);

  return (
    <div className="space-y-3">
      <div className="rounded border border-black/10 p-3">
        <svg aria-label="world map" className="h-44 w-full" viewBox="0 0 600 280">
          <rect fill="transparent" height="280" width="600" x="0" y="0" />
          <path d="M62 118 L130 92 L186 104 L178 144 L108 158 Z" fill="currentColor" opacity="0.2" />
          <path d="M170 170 L205 156 L220 185 L195 210 L176 201 Z" fill="currentColor" opacity="0.15" />
          <path d="M266 96 L324 80 L401 91 L414 132 L330 148 L274 126 Z" fill="currentColor" opacity="0.14" />
          <path d="M384 170 L420 162 L442 176 L434 210 L396 216 L372 194 Z" fill="currentColor" opacity="0.18" />
          <path d="M438 116 L506 102 L551 124 L545 170 L496 183 L452 165 Z" fill="currentColor" opacity="0.2" />

          <circle cx="120" cy="130" fill="currentColor" r="6" />
          <circle cx="338" cy="128" fill="currentColor" r="5" />
          <circle cx="500" cy="142" fill="currentColor" r="6" />
        </svg>
      </div>
      <div className="space-y-2">
        {regions.map((region) => {
          const width = (region.value / maxValue) * 100;
          return (
            <div className="space-y-1" key={region.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/70">{region.label}</span>
                <span className="font-medium">{region.value.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-black/10">
                <div className="h-2 rounded-full bg-black/70" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
