CREATE INDEX IF NOT EXISTS "id_idx" ON "product_entries" ("id");--> statement-breakpoint
ALTER TABLE "product_entries" ADD CONSTRAINT "unq" UNIQUE("product_id","size_id");