-- AlterTable
ALTER TABLE "group_members" ADD COLUMN     "requested_at" TIMESTAMP(3),
ALTER COLUMN "joined_at" DROP NOT NULL,
ALTER COLUMN "joined_at" DROP DEFAULT;
