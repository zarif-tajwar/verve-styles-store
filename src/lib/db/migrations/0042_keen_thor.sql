CREATE TABLE IF NOT EXISTS "order_customer_details" (
	"order_id" integer NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text,
	"address" text NOT NULL,
	"country" varchar NOT NULL,
	"city" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"label" text NOT NULL,
	"type" varchar DEFAULT 'not-relevant' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_customer_details" ADD CONSTRAINT "order_customer_details_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
