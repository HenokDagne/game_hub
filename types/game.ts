export type FreeToGameGame = {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
};

export type FreeToGameGameDetail = {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
};

export type Game = {
  id: number;
  name: string;
  slug: string;
  background_image: string | null;
  rating: number;
  released: string | null;
  short_description?: string;
  genre?: string;
  platform?: string;
};

export type GamesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
};

export type GameDetail = Game & {
  description_raw?: string;
  website?: string;
  metacritic?: number | null;
};
