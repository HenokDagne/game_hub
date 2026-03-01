"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type FavoriteButtonProps = {
  gameId: string;
  title: string;
  image?: string | null;
  initialFavorite?: boolean;
};

export default function FavoriteButton({ gameId, title, image, initialFavorite = false }: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();

  const toggleFavorite = () => {
    startTransition(async () => {
      if (!isFavorite) {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId, title, image }),
        });

        if (response.ok) {
          setIsFavorite(true);
          router.refresh();
        }

        return;
      }

      const response = await fetch(`/api/favorites/${gameId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsFavorite(false);
        router.refresh();
      }
    });
  };

  return (
    <button
      className="rounded border border-black/20 px-3 py-1 text-sm"
      disabled={isPending}
      onClick={toggleFavorite}
      type="button"
    >
      {isPending ? "Saving..." : isFavorite ? "Remove Favorite" : "Add Favorite"}
    </button>
  );
}
