/*
  Warnings:

  - You are about to drop the `GroupLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupLog" DROP CONSTRAINT "GroupLog_group_id_fkey";

-- DropTable
DROP TABLE "GroupLog";

-- CreateTable
CREATE TABLE "group_logs" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "group_logs" ADD CONSTRAINT "group_logs_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
