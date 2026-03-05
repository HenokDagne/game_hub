import type { ReactNode } from "react";

type AnalyticsSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function AnalyticsSectionCard({ title, description, children }: AnalyticsSectionCardProps) {
  return (
    <section className="space-y-3 rounded-lg border border-black/10 bg-white p-4">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? <p className="text-sm text-black/70">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
