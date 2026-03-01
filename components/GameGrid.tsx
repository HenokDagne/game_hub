import GameCard from "@/components/GameCard";
import type { Game } from "@/types/game";

type GameGridProps = {
  games: Game[];
};

export default function GameGrid({ games }: GameGridProps) {
  if (!games.length) {
    return <p className="rounded border border-black/10 p-6 text-center">No games found.</p>;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard game={game} key={game.id} />
      ))}
    </section>
  );
}
