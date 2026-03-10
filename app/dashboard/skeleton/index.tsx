type SkeletonLineProps = {
  className?: string;
};

function SkeletonLine({ className = "" }: SkeletonLineProps) {
  return <div className={`skeleton-block animate-pulse rounded ${className}`.trim()} />;
}

function SectionHeaderSkeleton({ titleWidth = "w-48" }: { titleWidth?: string }) {
  return (
    <div className="space-y-2">
      <SkeletonLine className={`h-8 ${titleWidth}`} />
      <SkeletonLine className="h-4 w-72" />
    </div>
  );
}

function ListItemSkeleton({ chips = 0 }: { chips?: number }) {
  return (
    <div className="rounded border border-black/10 p-4 space-y-2">
      <SkeletonLine className="h-5 w-48" />
      <SkeletonLine className="h-4 w-60" />
      {chips > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.from({ length: chips }).map((_, index) => (
            <SkeletonLine className="h-7 w-16" key={`chip-${index + 1}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DashboardSummarySkeleton() {
  return (
    <section className="profile-shell w-full space-y-4 rounded-2xl p-4">
      <div className="profile-border flex items-center justify-between border-b pb-2">
        <SkeletonLine className="h-4 w-40" />
        <SkeletonLine className="h-3 w-24" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,0.75fr)]">
        <div className="profile-panel space-y-4 rounded-xl border p-4">
          <div className="profile-border grid gap-4 border-b pb-4 lg:grid-cols-[160px_minmax(0,1fr)]">
            <div className="space-y-2">
              <SkeletonLine className="h-20 w-20 rounded-full" />
              <SkeletonLine className="h-4 w-28" />
              <SkeletonLine className="h-3 w-24" />
              <SkeletonLine className="h-4 w-20" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <SkeletonLine className="h-3 w-20" />
                <SkeletonLine className="h-3 w-20" />
              </div>
              <SkeletonLine className="h-2 w-full rounded-full" />
              <SkeletonLine className="h-3 w-28" />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div className="space-y-2 rounded border border-black/10 p-3" key={`metric-${index + 1}`}>
                    <SkeletonLine className="h-3 w-16" />
                    <SkeletonLine className="h-5 w-20" />
                    <SkeletonLine className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <SkeletonLine className="h-8 w-56" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="rounded border border-black/10 p-3" key={`transaction-${index + 1}`}>
                <div className="grid gap-2 sm:grid-cols-4">
                  <SkeletonLine className="h-4 w-20" />
                  <SkeletonLine className="h-4 w-24" />
                  <SkeletonLine className="h-4 w-16" />
                  <SkeletonLine className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <SkeletonLine className="h-3 w-20" />
          <div className="rounded border border-black/10 p-3 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="flex items-center gap-3" key={`feed-${index + 1}`}>
                <SkeletonLine className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonLine className="h-3 w-32" />
                  <SkeletonLine className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DashboardProfileSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-44" />
      <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
        <div className="rounded border border-black/10 p-4 space-y-3">
          <SkeletonLine className="h-20 w-20 rounded-full" />
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-4 w-28" />
        </div>
        <div className="rounded border border-black/10 p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="space-y-2" key={`profile-field-${index + 1}`}>
              <SkeletonLine className="h-3 w-24" />
              <SkeletonLine className="h-9 w-full" />
            </div>
          ))}
          <SkeletonLine className="h-10 w-36" />
        </div>
      </div>
    </section>
  );
}

export function DashboardLibrarySkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-56" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <ListItemSkeleton chips={3} key={`library-item-${index + 1}`} />
        ))}
      </div>
    </section>
  );
}

export function DashboardWishlistSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-36" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <ListItemSkeleton key={`wishlist-item-${index + 1}`} />
        ))}
      </div>
    </section>
  );
}

export function DashboardActivitySkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-44" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <ListItemSkeleton key={`activity-item-${index + 1}`} />
        ))}
      </div>
    </section>
  );
}

export function DashboardBillingSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-44" />
      <div className="rounded border border-black/10 p-4 space-y-3">
        <SkeletonLine className="h-4 w-2/3" />
        <SkeletonLine className="h-4 w-3/4" />
        <SkeletonLine className="h-4 w-1/2" />
      </div>
    </section>
  );
}

export function DashboardDownloadsSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-52" />
      <div className="rounded border border-black/10 p-4 space-y-3">
        <SkeletonLine className="h-4 w-3/4" />
        <SkeletonLine className="h-4 w-2/3" />
      </div>
    </section>
  );
}

export function DashboardAchievementsSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-56" />
      <div className="rounded border border-black/10 p-4 space-y-3">
        <SkeletonLine className="h-4 w-2/3" />
        <SkeletonLine className="h-4 w-1/2" />
        <SkeletonLine className="h-4 w-3/5" />
      </div>
    </section>
  );
}

export function DashboardNotificationsSkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-40" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="rounded border border-black/10 p-4 space-y-2" key={`notification-${index + 1}`}>
            <SkeletonLine className="h-4 w-1/2" />
            <SkeletonLine className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DashboardSecuritySkeleton() {
  return (
    <section className="space-y-4">
      <SectionHeaderSkeleton titleWidth="w-64" />
      <div className="grid gap-2 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="rounded border border-black/10 p-4" key={`security-card-${index + 1}`}>
            <SkeletonLine className="h-5 w-28" />
          </div>
        ))}
      </div>
    </section>
  );
}
