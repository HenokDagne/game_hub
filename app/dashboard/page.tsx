import { Activity, Coins, Medal, Wallet } from "lucide-react";
import ProfileActivityFeed from "@/components/profile/ProfileActivityFeed";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileMetricCard from "@/components/profile/ProfileMetricCard";
import ProfileTransactionTabs from "@/components/profile/ProfileTransactionTabs";
import type { ActivityItem, TransactionItem } from "@/components/profile/types";
import { prisma } from "@/lib/prisma";
import { getSafeServerSession } from "@/lib/session";

function isMissingTableError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2021";
}

function hasExtendedProfileModels() {
  const db = prisma as unknown as {
    profile?: { findUnique?: unknown };
    steamProfile?: { findUnique?: unknown };
  };

  return typeof db.profile?.findUnique === "function" && typeof db.steamProfile?.findUnique === "function";
}

export default async function DashboardPage() {
  const session = await getSafeServerSession();

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      createdAt: true,
      favorites: {
        orderBy: { createdAt: "desc" },
        take: 8,
      },
    },
  });

  if (!user) {
    return null;
  }

  let profile = null;
  let steamProfile = null;

  if (hasExtendedProfileModels()) {
    try {
      [profile, steamProfile] = await Promise.all([
        prisma.profile.findUnique({ where: { userId: user.id } }),
        prisma.steamProfile.findUnique({
          where: { userId: user.id },
          include: {
            friends: {
              orderBy: { createdAt: "desc" },
              take: 20,
            },
            gameStats: {
              orderBy: [{ hoursPlayed: "desc" }, { updatedAt: "desc" }],
              take: 10,
            },
            badges: {
              orderBy: [{ level: "desc" }, { createdAt: "desc" }],
              take: 20,
            },
            achievements: {
              orderBy: [{ unlockedAt: "desc" }, { createdAt: "desc" }],
              take: 20,
            },
          },
        }),
      ]);
    } catch (error) {
      if (!isMissingTableError(error)) {
        throw error;
      }
    }
  }

  const displayName = user.name ?? steamProfile?.personaName ?? "Player";
  const walletValue = (steamProfile?.totalHoursPlayed ?? 0) * 2.5 + user.favorites.length * 4;
  const progressLevel = Math.max(Math.floor((steamProfile?.totalHoursPlayed ?? 0) / 50) + 1, 1);
  const currentXp = Math.round((steamProfile?.totalHoursPlayed ?? 0) * 4);
  const nextLevelXp = progressLevel * 300;
  const progressPercent = Math.min(Math.round((currentXp / Math.max(nextLevelXp, 1)) * 100), 100);

  const metricCards = [
    {
      title: "Total Bet",
      value: `$${walletValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      subtitle: "Profile wallet equivalent",
      icon: <Wallet size={16} strokeWidth={1.8} />,
    },
    {
      title: "Deposited",
      value: `${(steamProfile?.friends.length ?? 0).toLocaleString()}`,
      subtitle: "Friend connections",
      icon: <Coins size={16} strokeWidth={1.8} />,
    },
    {
      title: "Rounds Won",
      value: `${(steamProfile?.achievements.length ?? 0).toLocaleString()}`,
      subtitle: "Achievements synced",
      icon: <Activity size={16} strokeWidth={1.8} />,
    },
    {
      title: "Total Profit",
      value: `${(steamProfile?.totalBadges ?? 0).toLocaleString()}`,
      subtitle: "Badges earned",
      icon: <Medal size={16} strokeWidth={1.8} />,
    },
  ];

  const transactions: TransactionItem[] =
    steamProfile?.gameStats.length
      ? steamProfile.gameStats.slice(0, 6).map((stat, index) => ({
          id: `${stat.appId}-${index}`,
          dateTime: (stat.lastPlayedAt ?? stat.updatedAt).toLocaleString(),
          method: "Steam Wallet",
          withdrawn: `$${Math.max(Math.round(stat.hoursPlayed * 2.1), 25)}`,
          receive: `$${Math.max(Math.round(stat.hoursPlayed * 5.3), 55).toLocaleString()}`,
          status: index % 4 === 0 ? "IN_PROGRESS" : index % 5 === 0 ? "FAILURE" : "SUCCESS",
        }))
      : [];

  const activityFeed: ActivityItem[] =
    steamProfile?.friends.length
      ? steamProfile.friends.slice(0, 10).map((friend, index) => ({
          id: `${friend.friendSteamId}-${index}`,
          name: friend.friendPersonaName ?? "Steam Friend",
          message: "Shared profile activity and updated recent game stats.",
          time: new Date(friend.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          badge: `${Math.max(5, 100 - index * 7)} lvl`,
          imageUrl: friend.friendAvatarUrl,
        }))
      : [];

  return (
    <section className="profile-shell w-full space-y-4 rounded-2xl p-4">
      <div className="profile-border flex items-center justify-between border-b pb-2">
        <p className="profile-muted-text text-sm">Welcome, {displayName}</p>
        <p className="profile-muted-text text-xs">Role: {user.role}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,0.75fr)]">
        <div className="profile-panel space-y-4 rounded-xl border p-4">
          <div className="profile-border grid gap-4 border-b pb-4 lg:grid-cols-[160px_minmax(0,1fr)]">
            <div className="space-y-2">
              <ProfileAvatar imageUrl={user.profileImage} name={displayName} size="lg" />
              <p className="profile-strong-text text-sm font-semibold tracking-[0.22em]">{displayName.toUpperCase()}</p>
              <p className="profile-muted-text text-xs">{profile?.location ?? steamProfile?.country ?? "Global"}</p>
              <p className="profile-accent-text text-sm font-medium">
                ${walletValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="space-y-3">
              <div className="profile-muted-text flex items-center justify-between text-xs">
                <p>Level {progressLevel}</p>
                <p>
                  {currentXp} / {nextLevelXp}
                </p>
              </div>
              <div className="h-2 rounded-full bg-black/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="profile-muted-text text-[11px]">Next level: Level {progressLevel + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metricCards.map((card) => (
                  <ProfileMetricCard
                    icon={card.icon}
                    key={card.title}
                    subtitle={card.subtitle}
                    title={card.title}
                    value={card.value}
                  />
                ))}
              </div>
            </div>
          </div>

          <ProfileTransactionTabs items={transactions} />
        </div>

        <div className="space-y-2">
          <p className="profile-muted-text text-xs uppercase tracking-[0.14em]">Live feed</p>
          <ProfileActivityFeed items={activityFeed} />
        </div>
      </div>
    </section>
  );
}
