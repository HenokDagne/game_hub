import FilterPanel from "@/components/FilterPanel";
import GameGrid from "@/components/GameGrid";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";
import { searchGames } from "@/lib/rawg";
import { getSafeServerSession } from "@/lib/session";

type GamesPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

function getSingleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const query = {
    search: getSingleParam(resolvedSearchParams.search),
    page: getSingleParam(resolvedSearchParams.page),
    page_size: getSingleParam(resolvedSearchParams.page_size),
    genre: getSingleParam(resolvedSearchParams.genre),
    category: getSingleParam(resolvedSearchParams.category),
    tag: getSingleParam(resolvedSearchParams.tag),
    platform: getSingleParam(resolvedSearchParams.platform),
    sort_by: getSingleParam(resolvedSearchParams.sort_by) ?? getSingleParam(resolvedSearchParams["sort-by"]),
    rating: getSingleParam(resolvedSearchParams.rating),
    year: getSingleParam(resolvedSearchParams.year),
  };

  const data = await searchGames(query);
  const page = Number(query.page ?? 1);

  const session = await getSafeServerSession();
  let favoriteGameIds: string[] = [];

  if (session?.user?.id && data.results.length) {
    const currentGameIds = data.results.map((game) => String(game.id));

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        gameId: {
          in: currentGameIds,
        },
      },
      select: {
        gameId: true,
      },
    });

    favoriteGameIds = favorites.map((favorite) => favorite.gameId);
  }

  const currentParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      currentParams.set(key, value);
    }
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <h1 className="text-3xl font-bold">Games</h1>
      <SearchBar />
      <FilterPanel />
      <GameGrid favoriteGameIds={favoriteGameIds} games={data.results} />
      <Pagination hasNext={Boolean(data.next)} page={page} searchParams={currentParams} />
    </main>
  );
}
