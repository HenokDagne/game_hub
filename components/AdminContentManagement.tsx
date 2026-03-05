"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type GameStatus = "PUBLISHED" | "DRAFT";

type ManagedGame = {
  id: string;
  title: string;
  status: GameStatus;
  platform: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  title: string;
  status: GameStatus;
  platform: string;
  categories: string;
  tags: string;
  featured: boolean;
  trending: boolean;
};

const initialForm: FormState = {
  title: "",
  status: "DRAFT",
  platform: "PC",
  categories: "",
  tags: "",
  featured: false,
  trending: false,
};

function csvToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminContentManagement() {
  const [games, setGames] = useState<ManagedGame[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "GET",
      });

      const data = (await response.json()) as { games?: ManagedGame[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load games");
      }

      setGames(data.games ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load games");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: form.title.trim(),
        status: form.status,
        platform: form.platform.trim(),
        categories: csvToArray(form.categories),
        tags: csvToArray(form.tags),
        featured: form.featured,
        trending: form.trending,
      };

      const response = await fetch("/api/admin/content", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save game");
      }

      setForm(initialForm);
      setEditingId(null);
      await loadGames();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save game");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(game: ManagedGame) {
    setEditingId(game.id);
    setForm({
      title: game.title,
      status: game.status,
      platform: game.platform,
      categories: game.categories.join(", "),
      tags: game.tags.join(", "),
      featured: game.featured,
      trending: game.trending,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function deleteGame(id: string) {
    const confirmed = window.confirm("Delete this game entry?");

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete game");
      }

      if (editingId === id) {
        cancelEdit();
      }

      await loadGames();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete game");
    }
  }

  const hasGames = useMemo(() => games.length > 0, [games]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Game/content management</h2>

      <form className="grid gap-3 rounded border border-black/10 p-4 sm:grid-cols-2" onSubmit={onSubmit}>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="font-medium">Game title</span>
          <input
            className="w-full rounded border border-black/15 px-3 py-2"
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Enter game title"
            required
            type="text"
            value={form.title}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Status</span>
          <select
            className="w-full rounded border border-black/15 px-3 py-2"
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value as FormState["status"] }))
            }
            value={form.status}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Platform</span>
          <input
            className="w-full rounded border border-black/15 px-3 py-2"
            onChange={(event) => setForm((prev) => ({ ...prev, platform: event.target.value }))}
            placeholder="PC, Browser, Mobile"
            required
            type="text"
            value={form.platform}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Categories</span>
          <input
            className="w-full rounded border border-black/15 px-3 py-2"
            onChange={(event) => setForm((prev) => ({ ...prev, categories: event.target.value }))}
            placeholder="Action, RPG, Strategy"
            type="text"
            value={form.categories}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Tags</span>
          <input
            className="w-full rounded border border-black/15 px-3 py-2"
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            placeholder="Multiplayer, Indie"
            type="text"
            value={form.tags}
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            checked={form.featured}
            onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
            type="checkbox"
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            checked={form.trending}
            onChange={(event) => setForm((prev) => ({ ...prev, trending: event.target.checked }))}
            type="checkbox"
          />
          Trending
        </label>

        <div className="flex gap-2 sm:col-span-2">
          <button className="rounded border border-black px-4 py-2 text-sm font-medium" disabled={isSubmitting}>
            {editingId ? "Save changes" : "Add game"}
          </button>
          {editingId ? (
            <button
              className="rounded border border-black/20 px-4 py-2 text-sm"
              onClick={cancelEdit}
              type="button"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {error ? <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm">{error}</p> : null}

      {isLoading ? <p className="text-sm text-black/70">Loading content...</p> : null}

      {!isLoading && !hasGames ? <p className="text-sm text-black/70">No games added yet.</p> : null}

      {!isLoading && hasGames ? (
        <div className="overflow-x-auto rounded border border-black/10">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.03]">
              <tr>
                <th className="px-3 py-2 font-semibold">Title</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Platform</th>
                <th className="px-3 py-2 font-semibold">Categories</th>
                <th className="px-3 py-2 font-semibold">Tags</th>
                <th className="px-3 py-2 font-semibold">Featured</th>
                <th className="px-3 py-2 font-semibold">Trending</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr className="border-b border-black/5" key={game.id}>
                  <td className="px-3 py-2">{game.title}</td>
                  <td className="px-3 py-2">{game.status}</td>
                  <td className="px-3 py-2">{game.platform}</td>
                  <td className="px-3 py-2">{game.categories.join(", ") || "-"}</td>
                  <td className="px-3 py-2">{game.tags.join(", ") || "-"}</td>
                  <td className="px-3 py-2">{game.featured ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">{game.trending ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded border border-black/20 px-2 py-1"
                        onClick={() => startEdit(game)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded border border-black/20 px-2 py-1"
                        onClick={() => deleteGame(game.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
