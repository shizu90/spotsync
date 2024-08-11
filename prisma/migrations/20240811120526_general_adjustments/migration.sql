/*
  Warnings:

  - You are about to alter the column `text` on the `group_logs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `name` on the `group_permissions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `group_roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `hex_color` on the `group_roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(7)`.
  - You are about to alter the column `groups` on the `group_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `posts` on the `group_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `spot_events` on the `group_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `name` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `about` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `group_picture` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `banner_picture` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `likable_subject` on the `likes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `file_path` on the `post_attachments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `file_type` on the `post_attachments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `title` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `visibility` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `area` on the `spot_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `sub_area` on the `spot_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `locality` on the `spot_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `latitude` on the `spot_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(9,6)`.
  - You are about to alter the column `longitude` on the `spot_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(9,6)`.
  - You are about to alter the column `country_code` on the `spot_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(2)`.
  - You are about to alter the column `file_path` on the `spot_photos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `name` on the `spots` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `spots` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `type` on the `spots` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `name` on the `user_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `area` on the `user_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `sub_area` on the `user_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `locality` on the `user_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `latitude` on the `user_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(9,6)`.
  - You are about to alter the column `longitude` on the `user_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(9,6)`.
  - You are about to alter the column `country_code` on the `user_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(2)`.
  - You are about to alter the column `name` on the `user_credentials` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `user_credentials` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `phone_number` on the `user_credentials` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `addresses` on the `user_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `favorite_spot_events` on the `user_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `favorite_spot_folders` on the `user_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `favorite_spots` on the `user_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `posts` on the `user_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `profile` on the `user_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `spot_folders` on the `user_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `visited_spots` on the `user_visibility_configs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(12)`.
  - You are about to alter the column `profile_picture` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `banner_picture` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `first_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `last_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `profile_theme_color` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(7)`.
  - A unique constraint covering the columns `[name]` on the table `user_credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "group_logs" ALTER COLUMN "text" SET DATA TYPE VARCHAR(400);

-- AlterTable
ALTER TABLE "group_permissions" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "group_roles" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "hex_color" SET DATA TYPE VARCHAR(7);

-- AlterTable
ALTER TABLE "group_visibility_configs" ALTER COLUMN "groups" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "posts" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "spot_events" SET DATA TYPE VARCHAR(12);

-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "about" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "group_picture" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "banner_picture" SET DATA TYPE VARCHAR(400);

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "likable_subject" SET DATA TYPE VARCHAR(12);

-- AlterTable
ALTER TABLE "post_attachments" ALTER COLUMN "file_path" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "file_type" SET DATA TYPE VARCHAR(12);

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "visibility" SET DATA TYPE VARCHAR(12);

-- AlterTable
ALTER TABLE "spot_addresses" ALTER COLUMN "area" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "sub_area" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "locality" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(9,6),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(9,6),
ALTER COLUMN "country_code" SET DATA TYPE CHAR(2);

-- AlterTable
ALTER TABLE "spot_photos" ALTER COLUMN "file_path" SET DATA TYPE VARCHAR(400);

-- AlterTable
ALTER TABLE "spots" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "type" SET DATA TYPE VARCHAR(120);

-- AlterTable
ALTER TABLE "user_addresses" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "area" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "sub_area" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "locality" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(9,6),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(9,6),
ALTER COLUMN "country_code" SET DATA TYPE CHAR(2);

-- AlterTable
ALTER TABLE "user_credentials" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "user_visibility_configs" ALTER COLUMN "addresses" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "favorite_spot_events" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "favorite_spot_folders" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "favorite_spots" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "posts" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "profile" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "spot_folders" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "visited_spots" SET DATA TYPE VARCHAR(12);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "profile_picture" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "banner_picture" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "profile_theme_color" SET DATA TYPE VARCHAR(7);

-- CreateIndex
CREATE UNIQUE INDEX "user_credentials_name_key" ON "user_credentials"("name");
