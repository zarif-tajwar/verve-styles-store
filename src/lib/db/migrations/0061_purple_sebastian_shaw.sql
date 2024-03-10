DROP INDEX IF EXISTS "product_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credential_user_id_idx" ON "credentials_account" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "oauth_user_id_idx" ON "oauth_account" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "user" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entry_product_id_idx" ON "product_entries" ("product_id");