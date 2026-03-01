import GameCard from "@/components/GameCard";
import type { Game } from "@/types/game";

type GameGridProps = {
  games: Game[];
  favoriteGameIds?: string[];
};

export default function GameGrid({ games, favoriteGameIds = [] }: GameGridProps) {
  const favoriteIds = new Set(favoriteGameIds);

  if (!games.length) {
    return <p className="rounded border border-black/10 p-6 text-center">No games found.</p>;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard game={game} initialFavorite={favoriteIds.has(String(game.id))} key={game.id} />
      ))}
    </section>
  );
}
