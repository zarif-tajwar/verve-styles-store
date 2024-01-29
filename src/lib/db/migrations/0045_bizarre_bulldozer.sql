ALTER TABLE "order_details" DROP CONSTRAINT "order_details_address_id_address_id_fk";
--> statement-breakpoint
ALTER TABLE "order_details" DROP COLUMN IF EXISTS "address_id";