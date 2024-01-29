CREATE TABLE IF NOT EXISTS "invoice" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"subtotal" numeric NOT NULL,
	"discount" numeric DEFAULT '0',
	"delivery_charge" numeric NOT NULL,
	"taxes" numeric DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_payment_details" (
	"order_id" integer PRIMARY KEY NOT NULL,
	"payment_method" varchar(128),
	"payment_method_session_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "order_details" ADD COLUMN "address_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_details" ADD CONSTRAINT "order_details_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_payment_details" ADD CONSTRAINT "order_payment_details_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
