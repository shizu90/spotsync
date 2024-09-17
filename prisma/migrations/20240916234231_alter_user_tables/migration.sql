/*
  Warnings:

  - You are about to drop the column `banner_picture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `biograph` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_theme_color` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `follow_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_member_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_visibility_configs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `follows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `group_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "follow_requests" DROP CONSTRAINT "follow_requests_from_user_id_fkey";

-- DropForeignKey
ALTER TABLE "follow_requests" DROP CONSTRAINT "follow_requests_to_user_id_fkey";

-- DropForeignKey
ALTER TABLE "group_member_requests" DROP CONSTRAINT "group_member_requests_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_member_requests" DROP CONSTRAINT "group_member_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_visibility_configs" DROP CONSTRAINT "user_visibility_configs_user_id_fkey";

-- AlterTable
ALTER TABLE "follows" ADD COLUMN     "status" VARCHAR(3) NOT NULL;

-- AlterTable
ALTER TABLE "group_members" ADD COLUMN     "status" VARCHAR(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "banner_picture",
DROP COLUMN "biograph",
DROP COLUMN "birth_date",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "profile_picture",
DROP COLUMN "profile_theme_color";

-- DropTable
DROP TABLE "follow_requests";

-- DropTable
DROP TABLE "group_member_requests";

-- DropTable
DROP TABLE "user_visibility_configs";

-- CreateTable
CREATE TABLE "user_visibility_settings" (
    "user_id" TEXT NOT NULL,
    "addresses" VARCHAR(12) NOT NULL,
    "favorite_spot_events" VARCHAR(12) NOT NULL,
    "favorite_spot_folders" VARCHAR(12) NOT NULL,
    "favorite_spots" VARCHAR(12) NOT NULL,
    "posts" VARCHAR(12) NOT NULL,
    "profile" VARCHAR(12) NOT NULL,
    "spot_folders" VARCHAR(12) NOT NULL,
    "visited_spots" VARCHAR(12) NOT NULL,

    CONSTRAINT "user_visibility_settings_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "user_id" TEXT NOT NULL,
    "profile_picture" TEXT,
    "banner_picture" TEXT,
    "biograph" VARCHAR(400),
    "birth_date" TIMESTAMP(3),
    "display_name" VARCHAR(255),
    "theme_color" VARCHAR(7),
    "visibility" VARCHAR(12) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "user_visibility_settings" ADD CONSTRAINT "user_visibility_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
