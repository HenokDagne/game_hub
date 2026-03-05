import type { ReactNode } from "react";

type ProfileMetricCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
};

export default function ProfileMetricCard({ icon, title, value, subtitle }: ProfileMetricCardProps) {
  return (
    <article className="profile-card rounded-xl border p-3 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="profile-muted-text text-[10px] uppercase tracking-[0.16em]">{title}</p>
          <p className="profile-strong-text text-lg font-semibold leading-tight">{value}</p>
          <p className="profile-muted-text text-xs">{subtitle}</p>
        </div>
        <span className="profile-border profile-muted-text inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-black/5">
          {icon}
        </span>
      </div>
    </article>
  );
}
