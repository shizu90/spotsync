-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "payload" JSONB NOT NULL DEFAULT '{}';
