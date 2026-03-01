import type { Metadata } from "next";
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
    <main className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <h1 className="text-3xl font-bold">{game.name}</h1>
      <p className="text-sm text-black/70">Released: {game.released ?? "Unknown"}</p>
      <p className="text-sm text-black/70">Metacritic: {game.metacritic ?? "N/A"}</p>
      <FavoriteButton gameId={String(game.id)} image={game.background_image} title={game.name} />
      <p className="leading-7">{game.description_raw ?? "No description available."}</p>
    </main>
  );
}
