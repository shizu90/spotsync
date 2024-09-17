/*
  Warnings:

  - You are about to drop the `group_visibility_configs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "group_visibility_configs" DROP CONSTRAINT "group_visibility_configs_group_id_fkey";

-- DropTable
DROP TABLE "group_visibility_configs";

-- CreateTable
CREATE TABLE "group_visibility_settings" (
    "group_id" TEXT NOT NULL,
    "groups" VARCHAR(12) NOT NULL,
    "posts" VARCHAR(12) NOT NULL,
    "spot_events" VARCHAR(12) NOT NULL,

    CONSTRAINT "group_visibility_settings_pkey" PRIMARY KEY ("group_id")
);

-- AddForeignKey
ALTER TABLE "group_visibility_settings" ADD CONSTRAINT "group_visibility_settings_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
