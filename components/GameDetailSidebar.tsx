import Image from "next/image";
import Link from "next/link";
import { searchGames } from "@/lib/rawg";

type GameDetailSidebarProps = {
  genre?: string;
  currentGameId: string;
};

export default async function GameDetailSidebar({ genre, currentGameId }: GameDetailSidebarProps) {
  const genreQuery = genre?.toLowerCase().replaceAll(" ", "-");

  let relatedGames: Awaited<ReturnType<typeof searchGames>>["results"] = [];

  if (genreQuery) {
    try {
      const allRelatedGames = new Map<number, Awaited<ReturnType<typeof searchGames>>["results"][number]>();
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const related = await searchGames({
          genre: genreQuery,
          page: String(page),
          page_size: "40",
        });

        related.results.forEach((relatedGame) => {
          if (String(relatedGame.id) !== currentGameId) {
            allRelatedGames.set(relatedGame.id, relatedGame);
          }
        });

        hasNext = Boolean(related.next);
        page += 1;

        if (page > 50) {
          break;
        }
      }

      relatedGames = Array.from(allRelatedGames.values());
    } catch {
      relatedGames = [];
    }
  }

  return (
    <aside className="sidebar-right-border space-y-3 border border-black/10 p-4 lg:ml-auto lg:mr-0 lg:sticky lg:top-24 lg:self-start lg:w-full lg:max-w-[20rem] lg:border-l lg:border-r-0">
      <h2 className="text-lg font-semibold">Same Genre</h2>
      <p className="text-sm text-black/70">{genre ?? "Unknown genre"}</p>
      {relatedGames.length ? (
        <div className="hide-scrollbar max-h-[calc(100vh-14rem)] space-y-3 overflow-y-auto pr-1">
          {relatedGames.map((relatedGame) => (
            <Link className="block rounded border border-black/10 p-2 hover:bg-black/5" href={`/games/${relatedGame.id}`} key={relatedGame.id}>
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-black/5">
                  {relatedGame.background_image ? (
                    <Image alt={relatedGame.name} className="object-cover" fill sizes="80px" src={relatedGame.background_image} />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{relatedGame.name}</p>
                  <p className="text-xs text-black/70">{relatedGame.platform ?? "Unknown platform"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-black/70">No related games available.</p>
      )}
    </aside>
  );
}
