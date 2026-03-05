-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "steam_id" TEXT NOT NULL,
    "persona_name" TEXT NOT NULL,
    "profile_url" TEXT NOT NULL,
    "avatar_url" TEXT,
    "country" TEXT,
    "online_status" TEXT NOT NULL DEFAULT 'OFFLINE',
    "total_hours_played" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_badges" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SteamProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamFriend" (
    "id" TEXT NOT NULL,
    "steam_profile_id" TEXT NOT NULL,
    "friend_steam_id" TEXT NOT NULL,
    "friend_persona_name" TEXT,
    "friend_profile_url" TEXT,
    "friend_avatar_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SteamFriend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamGameStat" (
    "id" TEXT NOT NULL,
    "steam_profile_id" TEXT NOT NULL,
    "app_id" INTEGER NOT NULL,
    "game_name" TEXT NOT NULL,
    "hours_played" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_played_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SteamGameStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamBadge" (
    "id" TEXT NOT NULL,
    "steam_profile_id" TEXT NOT NULL,
    "badge_code" TEXT NOT NULL,
    "badge_name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "earned_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SteamBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamAchievement" (
    "id" TEXT NOT NULL,
    "steam_profile_id" TEXT NOT NULL,
    "app_id" INTEGER NOT NULL,
    "achievement_code" TEXT NOT NULL,
    "achievement_name" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SteamAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamProfile_userId_key" ON "SteamProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SteamProfile_steam_id_key" ON "SteamProfile"("steam_id");

-- CreateIndex
CREATE UNIQUE INDEX "SteamFriend_steam_profile_id_friend_steam_id_key" ON "SteamFriend"("steam_profile_id", "friend_steam_id");

-- CreateIndex
CREATE UNIQUE INDEX "SteamGameStat_steam_profile_id_app_id_key" ON "SteamGameStat"("steam_profile_id", "app_id");

-- CreateIndex
CREATE UNIQUE INDEX "SteamBadge_steam_profile_id_badge_code_key" ON "SteamBadge"("steam_profile_id", "badge_code");

-- CreateIndex
CREATE UNIQUE INDEX "SteamAchievement_steam_profile_id_app_id_achievement_code_key" ON "SteamAchievement"("steam_profile_id", "app_id", "achievement_code");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamProfile" ADD CONSTRAINT "SteamProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamFriend" ADD CONSTRAINT "SteamFriend_steam_profile_id_fkey" FOREIGN KEY ("steam_profile_id") REFERENCES "SteamProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamGameStat" ADD CONSTRAINT "SteamGameStat_steam_profile_id_fkey" FOREIGN KEY ("steam_profile_id") REFERENCES "SteamProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamBadge" ADD CONSTRAINT "SteamBadge_steam_profile_id_fkey" FOREIGN KEY ("steam_profile_id") REFERENCES "SteamProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SteamAchievement" ADD CONSTRAINT "SteamAchievement_steam_profile_id_fkey" FOREIGN KEY ("steam_profile_id") REFERENCES "SteamProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
