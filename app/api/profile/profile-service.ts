import { prisma } from "@/lib/prisma";
import type { UpdateProfileInput } from "./validation";

const userSelect = {
  name: true,
  email: true,
  profileImage: true,
} as const;

const defaultExtendedPayload = {
  profile: null,
  steamProfile: null,
  friends: [],
  gameStats: [],
  badges: [],
  achievements: [],
};

export function isMissingTableError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2021";
}

export function hasExtendedProfileModels() {
  const db = prisma as unknown as {
    profile?: { findUnique?: unknown; upsert?: unknown };
    steamProfile?: { findUnique?: unknown; upsert?: unknown };
    steamFriend?: { deleteMany?: unknown; createMany?: unknown };
    steamGameStat?: { deleteMany?: unknown; createMany?: unknown };
    steamBadge?: { deleteMany?: unknown; createMany?: unknown };
    steamAchievement?: { deleteMany?: unknown; createMany?: unknown };
  };

  return (
    typeof db.profile?.findUnique === "function" &&
    typeof db.steamProfile?.findUnique === "function" &&
    typeof db.steamFriend?.deleteMany === "function" &&
    typeof db.steamGameStat?.deleteMany === "function" &&
    typeof db.steamBadge?.deleteMany === "function" &&
    typeof db.steamAchievement?.deleteMany === "function"
  );
}

export async function getBasicUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });
}

export function withDefaultExtendedPayload<TUser>(user: TUser) {
  return {
    user,
    ...defaultExtendedPayload,
  };
}

export async function getProfilePayload(userId: string) {
  const [profile, steamProfile] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      select: {
        bio: true,
        location: true,
        website: true,
      },
    }),
    prisma.steamProfile.findUnique({
      where: { userId },
      include: {
        friends: {
          orderBy: { createdAt: "desc" },
          take: 100,
        },
        gameStats: {
          orderBy: [{ hoursPlayed: "desc" }, { gameName: "asc" }],
          take: 300,
        },
        badges: {
          orderBy: [{ level: "desc" }, { badgeName: "asc" }],
          take: 500,
        },
        achievements: {
          orderBy: [{ unlockedAt: "desc" }, { achievementName: "asc" }],
          take: 2000,
        },
      },
    }),
  ]);

  return {
    profile,
    steamProfile,
    friends: steamProfile?.friends ?? [],
    gameStats: steamProfile?.gameStats ?? [],
    badges: steamProfile?.badges ?? [],
    achievements: steamProfile?.achievements ?? [],
  };
}

export async function updateProfilePayload(userId: string, parsed: UpdateProfileInput) {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        name: parsed.name,
        ...(typeof parsed.profileImage === "string" ? { profileImage: parsed.profileImage } : {}),
      },
    });

    const profile = parsed.profile
      ? await tx.profile.upsert({
          where: { userId },
          create: {
            userId,
            bio: parsed.profile.bio,
            location: parsed.profile.location,
            website: parsed.profile.website,
          },
          update: {
            bio: parsed.profile.bio,
            location: parsed.profile.location,
            website: parsed.profile.website,
          },
        })
      : await tx.profile.findUnique({ where: { userId } });

    let steamProfile = await tx.steamProfile.findUnique({
      where: { userId },
    });

    if (parsed.steamProfile) {
      steamProfile = await tx.steamProfile.upsert({
        where: { userId },
        create: {
          userId,
          steamId: parsed.steamProfile.steamId,
          personaName: parsed.steamProfile.personaName,
          profileUrl: parsed.steamProfile.profileUrl,
          avatarUrl: parsed.steamProfile.avatarUrl,
          country: parsed.steamProfile.country,
          onlineStatus: parsed.steamProfile.onlineStatus,
          totalHoursPlayed: parsed.steamProfile.totalHoursPlayed,
          totalBadges: parsed.steamProfile.totalBadges,
        },
        update: {
          steamId: parsed.steamProfile.steamId,
          personaName: parsed.steamProfile.personaName,
          profileUrl: parsed.steamProfile.profileUrl,
          avatarUrl: parsed.steamProfile.avatarUrl,
          country: parsed.steamProfile.country,
          onlineStatus: parsed.steamProfile.onlineStatus,
          totalHoursPlayed: parsed.steamProfile.totalHoursPlayed,
          totalBadges: parsed.steamProfile.totalBadges,
        },
      });
    }

    if (steamProfile) {
      if (parsed.friends) {
        await tx.steamFriend.deleteMany({ where: { steamProfileId: steamProfile.id } });
        if (parsed.friends.length) {
          await tx.steamFriend.createMany({
            data: parsed.friends.map((friend) => ({
              steamProfileId: steamProfile.id,
              friendSteamId: friend.friendSteamId,
              friendPersonaName: friend.friendPersonaName,
              friendProfileUrl: friend.friendProfileUrl,
              friendAvatarUrl: friend.friendAvatarUrl,
            })),
          });
        }
      }

      if (parsed.gameStats) {
        await tx.steamGameStat.deleteMany({ where: { steamProfileId: steamProfile.id } });
        if (parsed.gameStats.length) {
          await tx.steamGameStat.createMany({
            data: parsed.gameStats.map((stat) => ({
              steamProfileId: steamProfile.id,
              appId: stat.appId,
              gameName: stat.gameName,
              hoursPlayed: stat.hoursPlayed,
              lastPlayedAt: stat.lastPlayedAt,
            })),
          });
        }
      }

      if (parsed.badges) {
        await tx.steamBadge.deleteMany({ where: { steamProfileId: steamProfile.id } });
        if (parsed.badges.length) {
          await tx.steamBadge.createMany({
            data: parsed.badges.map((badge) => ({
              steamProfileId: steamProfile.id,
              badgeCode: badge.badgeCode,
              badgeName: badge.badgeName,
              level: badge.level,
              earnedAt: badge.earnedAt,
            })),
          });
        }
      }

      if (parsed.achievements) {
        await tx.steamAchievement.deleteMany({ where: { steamProfileId: steamProfile.id } });
        if (parsed.achievements.length) {
          await tx.steamAchievement.createMany({
            data: parsed.achievements.map((achievement) => ({
              steamProfileId: steamProfile.id,
              appId: achievement.appId,
              achievementCode: achievement.achievementCode,
              achievementName: achievement.achievementName,
              unlockedAt: achievement.unlockedAt,
            })),
          });
        }
      }
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    const latestSteam = steamProfile
      ? await tx.steamProfile.findUnique({
          where: { id: steamProfile.id },
          include: {
            friends: { orderBy: { createdAt: "desc" } },
            gameStats: { orderBy: [{ hoursPlayed: "desc" }, { gameName: "asc" }] },
            badges: { orderBy: [{ level: "desc" }, { badgeName: "asc" }] },
            achievements: { orderBy: [{ unlockedAt: "desc" }, { achievementName: "asc" }] },
          },
        })
      : null;

    return {
      user,
      profile,
      steamProfile: latestSteam,
      friends: latestSteam?.friends ?? [],
      gameStats: latestSteam?.gameStats ?? [],
      badges: latestSteam?.badges ?? [],
      achievements: latestSteam?.achievements ?? [],
    };
  });
}
