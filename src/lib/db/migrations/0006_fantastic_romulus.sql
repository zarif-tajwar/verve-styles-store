ALTER TABLE "product_entries" DROP CONSTRAINT "product_entries_product_id_size_id";--> statement-breakpoint
ALTER TABLE "product_entries" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "product_entries" ADD CONSTRAINT "product_entries_id" PRIMARY KEY("id");