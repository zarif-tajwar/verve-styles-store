CREATE INDEX IF NOT EXISTS "cart)items_id_idx" ON "cart_items" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cart)items_order_id_idx" ON "cart_items" ("cart_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cart)items_product_entry_id_idx" ON "cart_items" ("product_entry_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "carts_id_idx" ON "carts" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "carts_user_id_idx" ON "carts" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_line_id_idx" ON "order_line" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_line_order_id_idx" ON "order_line" ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_line_product_entry_id_idx" ON "order_line" ("product_entry_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_id" ON "orders" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_user_id_idx" ON "orders" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_review_id_idx" ON "user_reviews" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_review_order_line_idx" ON "user_reviews" ("order_line_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_Name_idx" ON "users" ("username");