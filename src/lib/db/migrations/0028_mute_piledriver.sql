CREATE TABLE IF NOT EXISTS "order_details" (
	"order_id" integer PRIMARY KEY NOT NULL,
	"placed_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"status_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_details" ADD CONSTRAINT "order_details_status_id_order_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "order_status"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
