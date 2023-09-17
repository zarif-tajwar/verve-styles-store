CREATE TABLE IF NOT EXISTS "clothing" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dress_styles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"price" numeric(6, 2) NOT NULL,
	"description" text,
	"color" varchar,
	"clothing_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sizes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_clothing_id_clothing_id_fk" FOREIGN KEY ("clothing_id") REFERENCES "clothing"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_clothing_id_dress_styles_id_fk" FOREIGN KEY ("clothing_id") REFERENCES "dress_styles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
