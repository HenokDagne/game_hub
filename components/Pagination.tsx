import Link from "next/link";

type PaginationProps = {
  page: number;
  hasNext: boolean;
  searchParams: URLSearchParams;
};

export default function Pagination({ page, hasNext, searchParams }: PaginationProps) {
  const prevParams = new URLSearchParams(searchParams.toString());
  const nextParams = new URLSearchParams(searchParams.toString());
  prevParams.set("page", String(Math.max(1, page - 1)));
  nextParams.set("page", String(page + 1));

  return (
    <div className="flex items-center justify-center gap-4">
      <Link
        aria-disabled={page <= 1}
        className="rounded border border-black/20 px-3 py-1 text-sm disabled:pointer-events-none"
        href={`/games?${prevParams.toString()}`}
      >
        Prev
      </Link>
      <span className="text-sm">Page {page}</span>
      <Link
        aria-disabled={!hasNext}
        className="rounded border border-black/20 px-3 py-1 text-sm"
        href={hasNext ? `/games?${nextParams.toString()}` : "#"}
      >
        Next
      </Link>
    </div>
  );
}
