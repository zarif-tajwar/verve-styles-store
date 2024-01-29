ALTER TABLE "order_details" ALTER COLUMN "status_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_line" ADD COLUMN "discount" numeric(3, 1) DEFAULT '0';