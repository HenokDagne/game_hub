"use client";

import { useState } from "react";
import ProfileAvatar from "@/components/profile/ProfileAvatar";

type ActivityItem = {
  id: string;
  name: string;
  message: string;
  time: string;
  badge: string;
  imageUrl?: string | null;
};

type ProfileActivityFeedProps = {
  items: ActivityItem[];
};

export default function ProfileActivityFeed({ items }: ProfileActivityFeedProps) {
  const [message, setMessage] = useState("");

  return (
    <aside className="profile-panel flex h-[620px] flex-col rounded-xl border p-3">
      <div className="hide-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <article className="profile-card rounded-lg border p-2" key={item.id}>
            <div className="flex items-start gap-2">
              <ProfileAvatar imageUrl={item.imageUrl} name={item.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="profile-strong-text truncate text-xs font-semibold">{item.name}</p>
                  <span className="rounded border border-emerald-400/30 bg-emerald-400/15 px-1.5 py-0.5 text-[10px] text-emerald-600">
                    {item.badge}
                  </span>
                </div>
                <p className="profile-muted-text mt-0.5 line-clamp-2 text-xs">{item.message}</p>
                <p className="profile-muted-text mt-1 text-[10px]">{item.time}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="profile-border profile-input-bg mt-2 rounded-lg border px-2 py-2">
        <input
          className="profile-strong-text w-full bg-transparent text-xs outline-none placeholder:text-black/40"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your message..."
          value={message}
        />
      </div>
    </aside>
  );
}
