import type {
  AchievementFormItem,
  BadgeFormItem,
  FormState,
  FriendFormItem,
  GameStatFormItem,
  OnlineStatus,
} from "./types";

export const createFriendItem = (): FriendFormItem => ({
  friendSteamId: "",
  friendPersonaName: "",
  friendProfileUrl: "",
  friendAvatarUrl: "",
});

export const createGameStatItem = (): GameStatFormItem => ({
  appId: "",
  gameName: "",
  hoursPlayed: "0",
  lastPlayedAt: "",
});

export const createBadgeItem = (): BadgeFormItem => ({
  badgeCode: "",
  badgeName: "",
  level: "1",
  earnedAt: "",
});

export const createAchievementItem = (): AchievementFormItem => ({
  appId: "",
  achievementCode: "",
  achievementName: "",
  unlockedAt: "",
});

export const initialForm: FormState = {
  name: "",
  profileImage: "",
  bio: "",
  location: "",
  website: "",
  steamId: "",
  personaName: "",
  profileUrl: "",
  avatarUrl: "",
  country: "",
  onlineStatus: "OFFLINE",
  totalHoursPlayed: "0",
  totalBadges: "0",
  friends: [],
  gameStats: [],
  badges: [],
  achievements: [],
};

export const onlineStatusOptions: OnlineStatus[] = ["OFFLINE", "ONLINE", "AWAY", "BUSY", "SNOOZE"];
