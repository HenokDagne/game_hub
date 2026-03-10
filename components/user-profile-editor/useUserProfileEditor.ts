import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { createAchievementItem, createBadgeItem, createFriendItem, createGameStatItem, initialForm } from "./constants";
import type { FormState } from "./types";
import { fetchProfile, updateProfile, uploadProfileImage } from "./api";
import { buildUpdatePayload, mapProfileResponseToForm } from "./utils";

export function useUserProfileEditor() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchProfile();

        if (!isMounted) {
          return;
        }

        setForm(mapProfileResponseToForm(data));
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load profile");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasSteamDataToSubmit = useMemo(
    () =>
      Boolean(
        form.steamId.trim() ||
          form.personaName.trim() ||
          form.profileUrl.trim() ||
          form.avatarUrl.trim() ||
          form.country.trim() ||
          Number(form.totalHoursPlayed || 0) > 0 ||
          Number(form.totalBadges || 0) > 0 ||
          form.onlineStatus !== "OFFLINE" ||
          form.friends.length ||
          form.gameStats.length ||
          form.badges.length ||
          form.achievements.length,
      ),
    [
      form.steamId,
      form.personaName,
      form.profileUrl,
      form.avatarUrl,
      form.country,
      form.totalHoursPlayed,
      form.totalBadges,
      form.onlineStatus,
      form.friends.length,
      form.gameStats.length,
      form.badges.length,
      form.achievements.length,
    ],
  );

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function updateCollectionItem<CollectionKey extends "friends" | "gameStats" | "badges" | "achievements", ItemKey extends keyof FormState[CollectionKey][number]>(
    collection: CollectionKey,
    index: number,
    key: ItemKey,
    value: FormState[CollectionKey][number][ItemKey],
  ) {
    setForm((previous) => ({
      ...previous,
      [collection]: previous[collection].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  }

  function removeCollectionItem(collection: "friends" | "gameStats" | "badges" | "achievements", index: number) {
    setForm((previous) => ({
      ...previous,
      [collection]: previous[collection].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function addFriend() {
    setForm((previous) => ({ ...previous, friends: [...previous.friends, createFriendItem()] }));
  }

  function addGameStat() {
    setForm((previous) => ({ ...previous, gameStats: [...previous.gameStats, createGameStatItem()] }));
  }

  function addBadge() {
    setForm((previous) => ({ ...previous, badges: [...previous.badges, createBadgeItem()] }));
  }

  function addAchievement() {
    setForm((previous) => ({ ...previous, achievements: [...previous.achievements, createAchievementItem()] }));
  }

  function onProfileImageFileChange(file: File | null) {
    setSelectedProfileImageFile(file);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      let profileImageUrl = form.profileImage;

      if (selectedProfileImageFile) {
        setIsUploadingImage(true);
        profileImageUrl = await uploadProfileImage(selectedProfileImageFile);
        setIsUploadingImage(false);
      }

      const payload = buildUpdatePayload({ ...form, profileImage: profileImageUrl }, hasSteamDataToSubmit);
      await updateProfile(payload);
      setForm((previous) => ({ ...previous, profileImage: profileImageUrl }));
      setSelectedProfileImageFile(null);
      setSuccessMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to update profile");
    } finally {
      setIsUploadingImage(false);
      setIsSaving(false);
    }
  }

  return {
    form,
    isLoading,
    isSaving,
    isUploadingImage,
    selectedProfileImageFile,
    error,
    successMessage,
    updateField,
    updateCollectionItem,
    removeCollectionItem,
    addFriend,
    addGameStat,
    addBadge,
    addAchievement,
    onProfileImageFileChange,
    onSubmit,
  };
}
