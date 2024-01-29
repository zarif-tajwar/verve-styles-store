ALTER TABLE "user_reviews" DROP CONSTRAINT "user_reviews_order_line_id_order_line_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_order_line_id_order_line_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "order_line"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
