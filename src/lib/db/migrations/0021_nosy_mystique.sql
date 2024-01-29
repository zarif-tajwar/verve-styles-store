ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "email" text;