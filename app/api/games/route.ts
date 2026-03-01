import { NextResponse } from "next/server";
import { searchGames } from "@/lib/rawg";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const data = await searchGames({
      search: url.searchParams.get("search") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      page_size: url.searchParams.get("page_size") ?? undefined,
      genre: url.searchParams.get("genre") ?? undefined,
      category: url.searchParams.get("category") ?? undefined,
      tag: url.searchParams.get("tag") ?? undefined,
      platform: url.searchParams.get("platform") ?? undefined,
      sort_by: url.searchParams.get("sort_by") ?? url.searchParams.get("sort-by") ?? undefined,
      sort: url.searchParams.get("sort") ?? undefined,
      rating: url.searchParams.get("rating") ?? undefined,
      year: url.searchParams.get("year") ?? undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch games";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
