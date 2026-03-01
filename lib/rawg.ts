import { z } from "zod";
import { getCached, setCached } from "@/lib/cache";
import type { FreeToGameGame, FreeToGameGameDetail, GameDetail, GamesResponse } from "@/types/game";

const querySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(40).default(20),
  genre: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  platform: z.string().optional(),
  sort_by: z.string().optional(),
  sort: z.string().optional(),
  rating: z.string().optional(),
  year: z.string().optional(),
});

const CACHE_TTL_MS = 60_000;

function freeToGameBaseUrl() {
  return process.env.FREETOGAME_BASE_URL ?? "https://www.freetogame.com/api";
}

function toAppGame(item: FreeToGameGame) {
  return {
    id: item.id,
    name: item.title,
    slug: `${item.id}-${item.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    background_image: item.thumbnail ?? null,
    rating: 0,
    released: item.release_date ?? null,
    short_description: item.short_description,
    genre: item.genre,
    platform: item.platform,
  };
}

function queryToFreeToGameRequest(query: z.infer<typeof querySchema>) {
  const params = new URLSearchParams();
  const endpoint = query.tag ? "filter" : "games";

  const category = query.category ?? query.genre;
  const sortValue = query.sort_by ?? query.sort;
  const platform = query.platform?.toLowerCase() === "all" ? undefined : query.platform;

  if (query.tag) {
    params.set("tag", query.tag);
  }

  if (!query.tag && category) {
    params.set("category", category);
  }

  if (platform) {
    params.set("platform", platform);
  }

  if (sortValue) {
    if (query.tag) {
      params.set("sort", sortValue);
    } else {
      params.set("sort-by", sortValue);
    }
  }

  return {
    endpoint,
    params,
  };
}

export function parseGameQuery(input: Record<string, string | undefined>) {
  return querySchema.parse(input);
}

export async function searchGames(input: Record<string, string | undefined>): Promise<GamesResponse> {
  const query = parseGameQuery(input);
  const requestTarget = queryToFreeToGameRequest(query);
  const sourceCacheKey = `source:${requestTarget.endpoint}:${requestTarget.params.toString()}`;

  const cachedSource = getCached<FreeToGameGame[]>(sourceCacheKey);

  let rawData: FreeToGameGame[];

  if (cachedSource) {
    rawData = cachedSource;
  } else {
    const response = await fetch(`${freeToGameBaseUrl()}/${requestTarget.endpoint}?${requestTarget.params.toString()}`, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 60,
      },
    });

    if (response.status === 404) {
      rawData = [];
      setCached(sourceCacheKey, rawData, CACHE_TTL_MS);
    } else if (!response.ok) {
      throw new Error(`FreeToGame error: ${response.status}`);
    } else {
      rawData = (await response.json()) as FreeToGameGame[];
      setCached(sourceCacheKey, rawData, CACHE_TTL_MS);
    }
  }

  let mapped = rawData.map(toAppGame);

  if (query.year) {
    const year = query.year;
    mapped = mapped.filter((item) => item.released?.startsWith(year));
  }

  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    mapped = mapped.filter((item) => item.name.toLowerCase().includes(searchTerm));
  }

  const start = (query.page - 1) * query.page_size;
  const end = start + query.page_size;
  const results = mapped.slice(start, end);
  const hasNext = end < mapped.length;

  const data: GamesResponse = {
    count: mapped.length,
    previous: query.page > 1 ? "previous" : null,
    next: hasNext ? "next" : null,
    results,
  };

  return data;
}

export async function getGameById(id: string): Promise<GameDetail> {
  const cacheKey = `game:${id}`;
  const cached = getCached<GameDetail>(cacheKey);
  if (cached) {
    return cached;
  }

  const params = new URLSearchParams({ id });
  const response = await fetch(`${freeToGameBaseUrl()}/game?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`FreeToGame game detail error: ${response.status}`);
  }

  const rawData = (await response.json()) as FreeToGameGameDetail;

  const data: GameDetail = {
    id: rawData.id,
    name: rawData.title,
    slug: `${rawData.id}-${rawData.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    background_image: rawData.thumbnail ?? null,
    rating: 0,
    released: rawData.release_date ?? null,
    description_raw: rawData.description,
    website: rawData.game_url,
    metacritic: null,
    genre: rawData.genre,
    platform: rawData.platform,
  };

  setCached(cacheKey, data, CACHE_TTL_MS);

  return data;
}
