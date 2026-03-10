export type OnlineStatus = "ONLINE" | "OFFLINE" | "AWAY" | "BUSY" | "SNOOZE";

export type FriendFormItem = {
  friendSteamId: string;
  friendPersonaName: string;
  friendProfileUrl: string;
  friendAvatarUrl: string;
};

export type GameStatFormItem = {
  appId: string;
  gameName: string;
  hoursPlayed: string;
  lastPlayedAt: string;
};

export type BadgeFormItem = {
  badgeCode: string;
  badgeName: string;
  level: string;
  earnedAt: string;
};

export type AchievementFormItem = {
  appId: string;
  achievementCode: string;
  achievementName: string;
  unlockedAt: string;
};

export type ProfileResponse = {
  user: {
    name: string | null;
    email: string;
    profileImage: string;
  };
  profile: {
    bio: string | null;
    location: string | null;
    website: string | null;
  } | null;
  steamProfile: {
    steamId: string;
    personaName: string;
    profileUrl: string;
    avatarUrl: string | null;
    country: string | null;
    onlineStatus: OnlineStatus;
    totalHoursPlayed: number;
    totalBadges: number;
  } | null;
  friends: Array<{
    friendSteamId: string;
    friendPersonaName: string | null;
    friendProfileUrl: string | null;
    friendAvatarUrl: string | null;
  }>;
  gameStats: Array<{
    appId: number;
    gameName: string;
    hoursPlayed: number;
    lastPlayedAt: string | null;
  }>;
  badges: Array<{
    badgeCode: string;
    badgeName: string;
    level: number;
    earnedAt: string | null;
  }>;
  achievements: Array<{
    appId: number;
    achievementCode: string;
    achievementName: string;
    unlockedAt: string | null;
  }>;
  error?: string;
};

export type FormState = {
  name: string;
  profileImage: string;
  bio: string;
  location: string;
  website: string;
  steamId: string;
  personaName: string;
  profileUrl: string;
  avatarUrl: string;
  country: string;
  onlineStatus: OnlineStatus;
  totalHoursPlayed: string;
  totalBadges: string;
  friends: FriendFormItem[];
  gameStats: GameStatFormItem[];
  badges: BadgeFormItem[];
  achievements: AchievementFormItem[];
};

export type ProfileUpdateResponse = {
  error?: string;
};

export type ProfileImageUploadResponse = {
  profileImage: string;
  error?: string;
};
