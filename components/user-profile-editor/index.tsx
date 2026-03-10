"use client";

import UserProfileEditorView from "./UserProfileEditorView";
import { useUserProfileEditor } from "./useUserProfileEditor";

export default function UserProfileEditorContainer() {
  const {
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
  } = useUserProfileEditor();

  if (isLoading) {
    return <p className="text-sm text-black/70">Loading profile...</p>;
  }

  return (
    <UserProfileEditorView
      error={error}
      form={form}
      isSaving={isSaving}
      isUploadingImage={isUploadingImage}
      onSubmit={onSubmit}
      onProfileImageFileChange={onProfileImageFileChange}
      addAchievement={addAchievement}
      addBadge={addBadge}
      addFriend={addFriend}
      addGameStat={addGameStat}
      removeCollectionItem={removeCollectionItem}
      selectedProfileImageFile={selectedProfileImageFile}
      successMessage={successMessage}
      updateCollectionItem={updateCollectionItem}
      updateField={updateField}
    />
  );
}
