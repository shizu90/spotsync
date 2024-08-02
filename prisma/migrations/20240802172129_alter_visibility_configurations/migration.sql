/*
  Warnings:

  - You are about to drop the column `event_visibility` on the `group_visibility_configs` table. All the data in the column will be lost.
  - You are about to drop the column `group_visibility` on the `group_visibility_configs` table. All the data in the column will be lost.
  - You are about to drop the column `post_visibility` on the `group_visibility_configs` table. All the data in the column will be lost.
  - You are about to drop the column `address_visibility` on the `user_visibility_configs` table. All the data in the column will be lost.
  - You are about to drop the column `poi_folder_visibility` on the `user_visibility_configs` table. All the data in the column will be lost.
  - You are about to drop the column `post_visibility` on the `user_visibility_configs` table. All the data in the column will be lost.
  - You are about to drop the column `profile_visibility` on the `user_visibility_configs` table. All the data in the column will be lost.
  - You are about to drop the column `visited_poi_visibility` on the `user_visibility_configs` table. All the data in the column will be lost.
  - Added the required column `groups` to the `group_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posts` to the `group_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spot_events` to the `group_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addresses` to the `user_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favorite_spot_events` to the `user_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favorite_spot_folders` to the `user_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favorite_spots` to the `user_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posts` to the `user_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile` to the `user_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spot_folders` to the `user_visibility_configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visited_spots` to the `user_visibility_configs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group_visibility_configs" DROP COLUMN "event_visibility",
DROP COLUMN "group_visibility",
DROP COLUMN "post_visibility",
ADD COLUMN     "groups" TEXT NOT NULL,
ADD COLUMN     "posts" TEXT NOT NULL,
ADD COLUMN     "spot_events" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_visibility_configs" DROP COLUMN "address_visibility",
DROP COLUMN "poi_folder_visibility",
DROP COLUMN "post_visibility",
DROP COLUMN "profile_visibility",
DROP COLUMN "visited_poi_visibility",
ADD COLUMN     "addresses" TEXT NOT NULL,
ADD COLUMN     "favorite_spot_events" TEXT NOT NULL,
ADD COLUMN     "favorite_spot_folders" TEXT NOT NULL,
ADD COLUMN     "favorite_spots" TEXT NOT NULL,
ADD COLUMN     "posts" TEXT NOT NULL,
ADD COLUMN     "profile" TEXT NOT NULL,
ADD COLUMN     "spot_folders" TEXT NOT NULL,
ADD COLUMN     "visited_spots" TEXT NOT NULL;
