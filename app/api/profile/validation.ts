import { z } from "zod";

function isAbsoluteUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const optionalText = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((value) => (value && value.length ? value : null));

const optionalUrl = z
  .string()
  .trim()
  .url()
  .optional()
  .transform((value) => (value && value.length ? value : null));

const optionalUrlOrLocalPath = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || value.startsWith("/") || isAbsoluteUrl(value), {
    message: "Invalid URL",
  })
  .transform((value) => (value && value.length ? value : null));

const profileSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(400)
    .optional()
    .transform((value) => (value && value.length ? value : null)),
  location: optionalText,
  website: optionalUrl,
});

const steamProfileSchema = z.object({
  steamId: z.string().trim().min(3).max(50).optional(),
  personaName: z.string().trim().min(2).max(80).optional(),
  profileUrl: z.string().trim().url().optional(),
  avatarUrl: optionalUrlOrLocalPath,
  country: optionalText,
  onlineStatus: z.enum(["ONLINE", "OFFLINE", "AWAY", "BUSY", "SNOOZE"]).optional(),
  totalHoursPlayed: z.coerce.number().min(0).max(200000).optional(),
  totalBadges: z.coerce.number().int().min(0).max(100000).optional(),
});

const friendSchema = z.object({
  friendSteamId: z.string().trim().min(1).max(50),
  friendPersonaName: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((value) => (value && value.length ? value : null)),
  friendProfileUrl: optionalUrlOrLocalPath,
  friendAvatarUrl: optionalUrlOrLocalPath,
});

const gameStatSchema = z.object({
  appId: z.coerce.number().int().positive(),
  gameName: z.string().trim().min(1).max(120),
  hoursPlayed: z.coerce.number().min(0).max(200000),
  lastPlayedAt: z
    .string()
    .datetime()
    .optional()
    .transform((value) => (value ? new Date(value) : null)),
});

const badgeSchema = z.object({
  badgeCode: z.string().trim().min(1).max(80),
  badgeName: z.string().trim().min(1).max(120),
  level: z.coerce.number().int().min(1).max(999),
  earnedAt: z
    .string()
    .datetime()
    .optional()
    .transform((value) => (value ? new Date(value) : null)),
});

const achievementSchema = z.object({
  appId: z.coerce.number().int().positive(),
  achievementCode: z.string().trim().min(1).max(120),
  achievementName: z.string().trim().min(1).max(160),
  unlockedAt: z
    .string()
    .datetime()
    .optional()
    .transform((value) => (value ? new Date(value) : null)),
});

export const updateSchema = z.object({
  name: z
    .string()
    .trim()
    .max(50)
    .optional()
    .transform((value) => (value && value.length ? value : null)),
  profileImage: optionalUrlOrLocalPath,
  profile: profileSchema.optional(),
  steamProfile: steamProfileSchema.optional(),
  friends: z.array(friendSchema).max(100).optional(),
  gameStats: z.array(gameStatSchema).max(300).optional(),
  badges: z.array(badgeSchema).max(500).optional(),
  achievements: z.array(achievementSchema).max(2000).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateSchema>;
