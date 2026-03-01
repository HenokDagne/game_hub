"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

export default function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key === "category") {
      params.delete("genre");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <select
        className="rounded border border-black/20 px-3 py-2 "
        defaultValue={searchParams.get("category") ?? searchParams.get("genre") ?? ""}
        onChange={(event) => updateParam("category", event.target.value)}
      >
        <option value="">All genres</option>
        <option value="shooter">Shooter</option>
        <option value="mmorpg">MMORPG</option>
        <option value="strategy">Strategy</option>
        <option value="moba">MOBA</option>
        <option value="racing">Racing</option>
        <option value="sports">Sports</option>
      </select>

      <select
        className="rounded border border-black/20 px-3 py-2"
        defaultValue={searchParams.get("platform") ?? ""}
        onChange={(event) => updateParam("platform", event.target.value)}
      >
        <option value="">All platforms</option>
        <option value="pc">PC</option>
        <option value="browser">Browser</option>
      </select>

      <select
        className="rounded border border-black/20 px-3 py-2"
        defaultValue={searchParams.get("year") ?? ""}
        onChange={(event) => updateParam("year", event.target.value)}
      >
        <option value="">Any year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
