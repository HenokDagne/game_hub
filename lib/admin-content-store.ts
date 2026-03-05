export type ManagedGameStatus = "PUBLISHED" | "DRAFT";

export type ManagedGame = {
  id: string;
  title: string;
  status: ManagedGameStatus;
  platform: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
};

let managedGames: ManagedGame[] = [];

export function listManagedGames() {
  return managedGames.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createManagedGame(input: Omit<ManagedGame, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();

  const game: ManagedGame = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...input,
  };

  managedGames = [game, ...managedGames];

  return game;
}

export function updateManagedGame(
  id: string,
  input: Omit<ManagedGame, "id" | "createdAt" | "updatedAt">,
) {
  const existing = managedGames.find((item) => item.id === id);

  if (!existing) {
    return null;
  }

  const updated: ManagedGame = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  managedGames = managedGames.map((item) => (item.id === id ? updated : item));

  return updated;
}

export function deleteManagedGame(id: string) {
  const exists = managedGames.some((item) => item.id === id);

  if (!exists) {
    return false;
  }

  managedGames = managedGames.filter((item) => item.id !== id);
  return true;
}
