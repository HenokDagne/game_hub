type SkeletonLineProps = {
  className?: string;
};

function SkeletonLine({ className = "" }: SkeletonLineProps) {
  return <div className={`skeleton-block animate-pulse rounded ${className}`.trim()} />;
}

function SectionHeaderSkeleton({ titleWidth = "w-44", subtitleWidth = "w-80" }: { titleWidth?: string; subtitleWidth?: string }) {
  return (
    <div className="space-y-2">
      <SkeletonLine className={`h-8 ${titleWidth}`} />
      <SkeletonLine className={`h-4 ${subtitleWidth}`} />
    </div>
  );
}

export function AdminOverviewSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-44" subtitleWidth="w-80" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <article className="rounded-lg border border-black/10 bg-black/[0.02] p-5 space-y-3" key={`overview-${index + 1}`}>
            <SkeletonLine className="h-4 w-28" />
            <SkeletonLine className="h-8 w-20" />
            <SkeletonLine className="h-3 w-32" />
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-4 space-y-2">
        <SkeletonLine className="h-4 w-5/6" />
        <SkeletonLine className="h-4 w-2/3" />
      </div>
    </section>
  );
}

export function AdminUsersSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-44" subtitleWidth="w-64" />

      <div className="grid gap-3 rounded border border-black/10 p-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="space-y-2" key={`filter-${index + 1}`}>
            <SkeletonLine className="h-4 w-16" />
            <SkeletonLine className="h-10 w-full" />
          </div>
        ))}
        <SkeletonLine className="h-10 w-32 sm:col-span-3" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-black/[0.015] p-3">
        <div className="mb-3 flex items-center justify-between">
          <SkeletonLine className="h-4 w-40" />
          <SkeletonLine className="h-8 w-28" />
        </div>

        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="grid gap-2 rounded border border-black/10 p-3 md:grid-cols-6" key={`user-row-${index + 1}`}>
              <SkeletonLine className="h-5 w-8" />
              <SkeletonLine className="h-5 w-36" />
              <SkeletonLine className="h-5 w-48" />
              <SkeletonLine className="h-5 w-20" />
              <SkeletonLine className="h-5 w-24" />
              <SkeletonLine className="h-5 w-28" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminContentSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-64" subtitleWidth="w-72" />

      <div className="grid gap-3 rounded border border-black/10 p-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-10 w-full" />
        </div>

        {Array.from({ length: 4 }).map((_, index) => (
          <div className="space-y-2" key={`content-field-${index + 1}`}>
            <SkeletonLine className="h-4 w-20" />
            <SkeletonLine className="h-10 w-full" />
          </div>
        ))}

        <div className="space-y-2">
          <SkeletonLine className="h-4 w-20" />
          <SkeletonLine className="h-6 w-24" />
        </div>
        <div className="space-y-2">
          <SkeletonLine className="h-4 w-20" />
          <SkeletonLine className="h-6 w-24" />
        </div>

        <div className="flex gap-2 sm:col-span-2">
          <SkeletonLine className="h-10 w-32" />
          <SkeletonLine className="h-10 w-24" />
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-black/10 p-3 space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="grid gap-2 rounded border border-black/10 p-3 md:grid-cols-8" key={`game-row-${index + 1}`}>
            <SkeletonLine className="h-5 w-28" />
            <SkeletonLine className="h-5 w-16" />
            <SkeletonLine className="h-5 w-16" />
            <SkeletonLine className="h-5 w-20" />
            <SkeletonLine className="h-5 w-20" />
            <SkeletonLine className="h-5 w-12" />
            <SkeletonLine className="h-5 w-12" />
            <SkeletonLine className="h-5 w-20" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminOrdersSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-44" subtitleWidth="w-80" />
      <div className="rounded border border-black/10 p-4 space-y-2">
        <SkeletonLine className="h-4 w-2/3" />
        <SkeletonLine className="h-4 w-1/2" />
      </div>
    </section>
  );
}

export function AdminModerationSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-36" subtitleWidth="w-80" />
      <div className="rounded border border-black/10 p-4 space-y-2">
        <SkeletonLine className="h-4 w-2/3" />
        <SkeletonLine className="h-4 w-1/2" />
      </div>
    </section>
  );
}

export function AdminAnalyticsSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-28" subtitleWidth="w-48" />

      <div className="grid gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article className="rounded-lg border border-black/10 bg-white p-4 space-y-3" key={`metric-${index + 1}`}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <SkeletonLine className="h-3 w-20" />
                <SkeletonLine className="h-7 w-24" />
                <SkeletonLine className="h-3 w-16" />
              </div>
              <SkeletonLine className="h-8 w-8" />
            </div>
            <div className="flex items-center justify-between">
              <SkeletonLine className="h-3 w-12" />
              <SkeletonLine className="h-3 w-20" />
            </div>
            <SkeletonLine className="h-12 w-full" />
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="space-y-3 rounded-lg border border-black/10 bg-white p-4">
          <div className="space-y-2">
            <SkeletonLine className="h-5 w-32" />
            <SkeletonLine className="h-4 w-28" />
          </div>
          <div className="h-64 rounded border border-black/10 p-3">
            <SkeletonLine className="h-full w-full" />
          </div>
        </section>

        <section className="space-y-3 rounded-lg border border-black/10 bg-white p-4">
          <div className="space-y-2">
            <SkeletonLine className="h-5 w-24" />
            <SkeletonLine className="h-4 w-44" />
          </div>
          <div className="h-64 rounded border border-black/10 p-3">
            <SkeletonLine className="h-full w-full" />
          </div>
        </section>
      </div>
    </section>
  );
}
