import type { FormEvent } from "react";
import { onlineStatusOptions } from "./constants";
import type { FormState } from "./types";

type UserProfileEditorViewProps = {
  form: FormState;
  isSaving: boolean;
  isUploadingImage: boolean;
  selectedProfileImageFile: File | null;
  error: string | null;
  successMessage: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  updateField: <Key extends keyof FormState>(key: Key, value: FormState[Key]) => void;
  updateCollectionItem: <CollectionKey extends "friends" | "gameStats" | "badges" | "achievements", ItemKey extends keyof FormState[CollectionKey][number]>(
    collection: CollectionKey,
    index: number,
    key: ItemKey,
    value: FormState[CollectionKey][number][ItemKey],
  ) => void;
  removeCollectionItem: (collection: "friends" | "gameStats" | "badges" | "achievements", index: number) => void;
  addFriend: () => void;
  addGameStat: () => void;
  addBadge: () => void;
  addAchievement: () => void;
  onProfileImageFileChange: (file: File | null) => void;
};

export default function UserProfileEditorView({
  form,
  isSaving,
  isUploadingImage,
  selectedProfileImageFile,
  error,
  successMessage,
  onSubmit,
  updateField,
  updateCollectionItem,
  removeCollectionItem,
  addFriend,
  addGameStat,
  addBadge,
  addAchievement,
  onProfileImageFileChange,
}: UserProfileEditorViewProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Edit profile</h2>
        <p className="text-sm text-black/70">Update your account profile and Steam game profile data.</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-3 rounded border border-black/10 p-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Display name</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("name", event.target.value)}
              type="text"
              value={form.name}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Profile image file</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => onProfileImageFileChange(event.target.files?.[0] ?? null)}
              type="file"
            />
            <p className="text-xs text-black/60">
              Current image: {form.profileImage || "Not set"}
              {selectedProfileImageFile ? ` • Selected: ${selectedProfileImageFile.name}` : ""}
            </p>
          </label>

          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Bio</span>
            <textarea
              className="min-h-24 w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("bio", event.target.value)}
              value={form.bio}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Location</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("location", event.target.value)}
              type="text"
              value={form.location}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Website</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("website", event.target.value)}
              placeholder="https://..."
              type="url"
              value={form.website}
            />
          </label>
        </div>

        <div className="grid gap-3 rounded border border-black/10 p-4 sm:grid-cols-2">
          <p className="sm:col-span-2 text-sm text-black/70">
            Steam profile fields are optional, but Steam ID, Persona Name, and Profile URL are required to save Steam data.
          </p>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Steam ID</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("steamId", event.target.value)}
              type="text"
              value={form.steamId}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Persona name</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("personaName", event.target.value)}
              type="text"
              value={form.personaName}
            />
          </label>

          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Steam profile URL</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("profileUrl", event.target.value)}
              type="url"
              value={form.profileUrl}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Avatar URL</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("avatarUrl", event.target.value)}
              type="url"
              value={form.avatarUrl}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Country</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("country", event.target.value)}
              type="text"
              value={form.country}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Online status</span>
            <select
              className="w-full rounded border border-black/15 px-3 py-2"
              onChange={(event) => updateField("onlineStatus", event.target.value as FormState["onlineStatus"])}
              value={form.onlineStatus}
            >
              {onlineStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Total hours played</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              min={0}
              onChange={(event) => updateField("totalHoursPlayed", event.target.value)}
              step="0.1"
              type="number"
              value={form.totalHoursPlayed}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Total badges</span>
            <input
              className="w-full rounded border border-black/15 px-3 py-2"
              min={0}
              onChange={(event) => updateField("totalBadges", event.target.value)}
              type="number"
              value={form.totalBadges}
            />
          </label>
        </div>

        <div className="grid gap-3 rounded border border-black/10 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Friend list</p>
              <button className="rounded border border-black/15 px-2 py-1 text-xs" onClick={addFriend} type="button">
                Add friend
              </button>
            </div>
            <div className="space-y-2">
              {form.friends.length ? (
                form.friends.map((friend, index) => (
                  <div className="grid gap-2 rounded border border-black/10 p-3 sm:grid-cols-2" key={`friend-${index}`}>
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      onChange={(event) => updateCollectionItem("friends", index, "friendSteamId", event.target.value)}
                      placeholder="Friend Steam ID"
                      value={friend.friendSteamId}
                    />
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      onChange={(event) => updateCollectionItem("friends", index, "friendPersonaName", event.target.value)}
                      placeholder="Friend persona name"
                      value={friend.friendPersonaName}
                    />
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      onChange={(event) => updateCollectionItem("friends", index, "friendProfileUrl", event.target.value)}
                      placeholder="Friend profile URL"
                      type="url"
                      value={friend.friendProfileUrl}
                    />
                    <div className="flex gap-2">
                      <input
                        className="w-full rounded border border-black/15 px-3 py-2 text-sm"
                        onChange={(event) => updateCollectionItem("friends", index, "friendAvatarUrl", event.target.value)}
                        placeholder="Friend avatar URL"
                        type="url"
                        value={friend.friendAvatarUrl}
                      />
                      <button
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
                        onClick={() => removeCollectionItem("friends", index)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-black/60">No friends added.</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Game stats</p>
              <button className="rounded border border-black/15 px-2 py-1 text-xs" onClick={addGameStat} type="button">
                Add game stat
              </button>
            </div>
            <div className="space-y-2">
              {form.gameStats.length ? (
                form.gameStats.map((stat, index) => (
                  <div className="grid gap-2 rounded border border-black/10 p-3 sm:grid-cols-2" key={`stat-${index}`}>
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      min={1}
                      onChange={(event) => updateCollectionItem("gameStats", index, "appId", event.target.value)}
                      placeholder="App ID"
                      type="number"
                      value={stat.appId}
                    />
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      onChange={(event) => updateCollectionItem("gameStats", index, "gameName", event.target.value)}
                      placeholder="Game name"
                      value={stat.gameName}
                    />
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      min={0}
                      onChange={(event) => updateCollectionItem("gameStats", index, "hoursPlayed", event.target.value)}
                      placeholder="Hours played"
                      step="0.1"
                      type="number"
                      value={stat.hoursPlayed}
                    />
                    <div className="flex gap-2">
                      <input
                        className="w-full rounded border border-black/15 px-3 py-2 text-sm"
                        onChange={(event) => updateCollectionItem("gameStats", index, "lastPlayedAt", event.target.value)}
                        type="datetime-local"
                        value={stat.lastPlayedAt}
                      />
                      <button
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
                        onClick={() => removeCollectionItem("gameStats", index)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-black/60">No game stats added.</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Badges</p>
              <button className="rounded border border-black/15 px-2 py-1 text-xs" onClick={addBadge} type="button">
                Add badge
              </button>
            </div>
            <div className="space-y-2">
              {form.badges.length ? (
                form.badges.map((badge, index) => (
                  <div className="grid gap-2 rounded border border-black/10 p-3 sm:grid-cols-2" key={`badge-${index}`}>
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      onChange={(event) => updateCollectionItem("badges", index, "badgeCode", event.target.value)}
                      placeholder="Badge code"
                      value={badge.badgeCode}
                    />
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      onChange={(event) => updateCollectionItem("badges", index, "badgeName", event.target.value)}
                      placeholder="Badge name"
                      value={badge.badgeName}
                    />
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      min={1}
                      onChange={(event) => updateCollectionItem("badges", index, "level", event.target.value)}
                      placeholder="Level"
                      type="number"
                      value={badge.level}
                    />
                    <div className="flex gap-2">
                      <input
                        className="w-full rounded border border-black/15 px-3 py-2 text-sm"
                        onChange={(event) => updateCollectionItem("badges", index, "earnedAt", event.target.value)}
                        type="datetime-local"
                        value={badge.earnedAt}
                      />
                      <button
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
                        onClick={() => removeCollectionItem("badges", index)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-black/60">No badges added.</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Achievements</p>
              <button className="rounded border border-black/15 px-2 py-1 text-xs" onClick={addAchievement} type="button">
                Add achievement
              </button>
            </div>
            <div className="space-y-2">
              {form.achievements.length ? (
                form.achievements.map((achievement, index) => (
                  <div className="grid gap-2 rounded border border-black/10 p-3 sm:grid-cols-2" key={`achievement-${index}`}>
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      min={1}
                      onChange={(event) => updateCollectionItem("achievements", index, "appId", event.target.value)}
                      placeholder="App ID"
                      type="number"
                      value={achievement.appId}
                    />
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      onChange={(event) => updateCollectionItem("achievements", index, "achievementCode", event.target.value)}
                      placeholder="Achievement code"
                      value={achievement.achievementCode}
                    />
                    <input
                      className="rounded border border-black/15 px-3 py-2 text-sm"
                      onChange={(event) => updateCollectionItem("achievements", index, "achievementName", event.target.value)}
                      placeholder="Achievement name"
                      value={achievement.achievementName}
                    />
                    <div className="flex gap-2">
                      <input
                        className="w-full rounded border border-black/15 px-3 py-2 text-sm"
                        onChange={(event) => updateCollectionItem("achievements", index, "unlockedAt", event.target.value)}
                        type="datetime-local"
                        value={achievement.unlockedAt}
                      />
                      <button
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
                        onClick={() => removeCollectionItem("achievements", index)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-black/60">No achievements added.</p>
              )}
            </div>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

        <button className="rounded border border-black px-4 py-2 text-sm font-medium" disabled={isSaving || isUploadingImage} type="submit">
          {isUploadingImage ? "Uploading image..." : isSaving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}
