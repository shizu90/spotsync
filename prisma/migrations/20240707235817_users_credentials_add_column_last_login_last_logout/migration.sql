-- AlterTable
ALTER TABLE "user_credentials" ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "last_logout" TIMESTAMP(3);
