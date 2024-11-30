-- AlterTable
ALTER TABLE "post_attachments" ADD COLUMN     "file_content" TEXT;

-- AlterTable
ALTER TABLE "spot_photos" ADD COLUMN     "file_content" TEXT,
ALTER COLUMN "file_path" SET DATA TYPE TEXT;
