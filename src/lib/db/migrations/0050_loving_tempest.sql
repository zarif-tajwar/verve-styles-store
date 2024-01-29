CREATE TABLE IF NOT EXISTS "edge_store_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" integer NOT NULL,
	"attribute" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
