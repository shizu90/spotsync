-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
