/*
  Warnings:

  - You are about to drop the `follow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_group_member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_group_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_group_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_group_role_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_group_visibility_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_visibility_config` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "follow" DROP CONSTRAINT "follow_from_user_id_fkey";

-- DropForeignKey
ALTER TABLE "follow" DROP CONSTRAINT "follow_to_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_group_member" DROP CONSTRAINT "user_group_member_user_group_id_fkey";

-- DropForeignKey
ALTER TABLE "user_group_member" DROP CONSTRAINT "user_group_member_user_group_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_group_member" DROP CONSTRAINT "user_group_member_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_group_role_permission" DROP CONSTRAINT "user_group_role_permission_user_group_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "user_group_role_permission" DROP CONSTRAINT "user_group_role_permission_user_group_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_group_visibility_config" DROP CONSTRAINT "user_group_visibility_config_user_group_id_fkey";

-- DropForeignKey
ALTER TABLE "user_visibility_config" DROP CONSTRAINT "user_visibility_config_user_id_fkey";

-- DropTable
DROP TABLE "follow";

-- DropTable
DROP TABLE "user_group";

-- DropTable
DROP TABLE "user_group_member";

-- DropTable
DROP TABLE "user_group_permission";

-- DropTable
DROP TABLE "user_group_role";

-- DropTable
DROP TABLE "user_group_role_permission";

-- DropTable
DROP TABLE "user_group_visibility_config";

-- DropTable
DROP TABLE "user_visibility_config";

-- CreateTable
CREATE TABLE "user_visibility_configs" (
    "user_id" TEXT NOT NULL,
    "profile_visibility" TEXT NOT NULL,
    "address_visibility" TEXT NOT NULL,
    "poi_folder_visibility" TEXT NOT NULL,
    "visited_poi_visibility" TEXT NOT NULL,
    "post_visibility" TEXT NOT NULL,

    CONSTRAINT "user_visibility_configs_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "followed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "group_picture" TEXT NOT NULL,
    "banner_picture" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_visibility_configs" (
    "group_id" TEXT NOT NULL,
    "post_visibility" TEXT NOT NULL,
    "event_visibility" TEXT NOT NULL,
    "group_visibility" TEXT NOT NULL,

    CONSTRAINT "group_visibility_configs_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" TEXT NOT NULL,
    "is_creator" BOOLEAN NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "group_role_id" TEXT NOT NULL,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_member_requests" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "requested_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_member_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex_color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_immutable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "group_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_role_permissions" (
    "group_role_id" TEXT NOT NULL,
    "group_permission_id" TEXT NOT NULL,

    CONSTRAINT "group_role_permissions_pkey" PRIMARY KEY ("group_permission_id","group_role_id")
);

-- CreateTable
CREATE TABLE "group_permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "group_permissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_visibility_configs" ADD CONSTRAINT "user_visibility_configs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_visibility_configs" ADD CONSTRAINT "group_visibility_configs_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_role_id_fkey" FOREIGN KEY ("group_role_id") REFERENCES "group_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member_requests" ADD CONSTRAINT "group_member_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member_requests" ADD CONSTRAINT "group_member_requests_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_role_permissions" ADD CONSTRAINT "group_role_permissions_group_role_id_fkey" FOREIGN KEY ("group_role_id") REFERENCES "group_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_role_permissions" ADD CONSTRAINT "group_role_permissions_group_permission_id_fkey" FOREIGN KEY ("group_permission_id") REFERENCES "group_permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
