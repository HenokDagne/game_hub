import type { Metadata } from "next";
import Image from "next/image";
import GameDetailSidebar from "@/components/GameDetailSidebar";
import FavoriteButton from "@/components/FavoriteButton";
import { getGameById } from "@/lib/rawg";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const game = await getGameById(id);

  return {
    title: `${game.name} | GameHub`,
    description: game.description_raw?.slice(0, 150) ?? `Details for ${game.name}`,
    openGraph: {
      title: game.name,
      description: game.description_raw?.slice(0, 150),
      images: game.background_image ? [game.background_image] : [],
    },
  };
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;
  const game = await getGameById(id);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="space-y-6">
          <h1 className="text-3xl font-bold">{game.name}</h1>
          {game.background_image ? (
            <div className="relative h-64 w-full overflow-hidden rounded border border-black/10 bg-black/5 sm:h-80">
              <Image alt={game.name} className="object-cover" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 65vw, 900px" src={game.background_image} />
            </div>
          ) : null}
          <p className="text-sm text-black/70">Released: {game.released ?? "Unknown"}</p>
          <p className="text-sm text-black/70">Metacritic: {game.metacritic ?? "N/A"}</p>
          <FavoriteButton gameId={String(game.id)} image={game.background_image} title={game.name} />
          <p className="leading-7">{game.description_raw ?? "No description available."}</p>
        </section>
        <GameDetailSidebar currentGameId={id} genre={game.genre} />
      </div>
    </main>
  );
}
