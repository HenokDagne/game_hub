import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import type { Game } from "@/types/game";

type GameCardProps = {
  game: Game;
};

export default function GameCard({ game }: GameCardProps) {
  return (
    <article className="overflow-hidden rounded border border-black/10">
      <Link href={`/games/${game.id}`}>
        <div className="relative h-44 w-full bg-black/5">
          {game.background_image ? (
            <Image alt={game.name} className="object-cover" fill src={game.background_image} sizes="(max-width: 768px) 100vw, 33vw" />
          ) : null}
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <Link className="block text-lg font-semibold" href={`/games/${game.id}`}>
          {game.name}
        </Link>
        <p className="text-sm text-black/70">{game.genre ?? "Unknown genre"} · {game.platform ?? "Unknown platform"}</p>
        {game.short_description ? <p className="text-sm text-black/70">{game.short_description}</p> : null}
        <FavoriteButton gameId={String(game.id)} image={game.background_image} title={game.name} />
      </div>
    </article>
  );
}
