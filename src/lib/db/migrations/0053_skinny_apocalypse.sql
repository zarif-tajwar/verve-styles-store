DROP TABLE "account";--> statement-breakpoint
DROP TABLE "session";--> statement-breakpoint
DROP TABLE "user";--> statement-breakpoint
DROP TABLE "verificationToken";--> statement-breakpoint
ALTER TABLE "address" DROP CONSTRAINT "address_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "carts" DROP CONSTRAINT "carts_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_user_id_fk";
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_image_idx" ON "product_images" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_image_product_id_idx" ON "product_images" ("product_id");