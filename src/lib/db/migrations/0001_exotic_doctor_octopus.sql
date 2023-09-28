CREATE TABLE IF NOT EXISTS "product_entries" (
	"product_id" integer NOT NULL,
	"size_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"sku" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT product_entries_product_id_size_id PRIMARY KEY("product_id","size_id")
);
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_clothing_id_dress_styles_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "style_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_style_id_dress_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "dress_styles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_entries" ADD CONSTRAINT "product_entries_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_entries" ADD CONSTRAINT "product_entries_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
