-- AlterTable
ALTER TABLE "spot_event_participants" ADD COLUMN     "participated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
