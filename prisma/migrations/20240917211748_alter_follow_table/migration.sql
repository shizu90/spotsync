-- AlterTable
ALTER TABLE "follows" ADD COLUMN     "requested_at" TIMESTAMP(3),
ALTER COLUMN "followed_at" DROP NOT NULL,
ALTER COLUMN "followed_at" DROP DEFAULT;
