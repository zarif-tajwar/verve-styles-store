CREATE TABLE IF NOT EXISTS "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"country" varchar NOT NULL,
	"city" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"label" text,
	"type" varchar DEFAULT 'not-relevant',
	"user_id" text,
	"dummy_user_id" varchar,
	"is_default" boolean DEFAULT false,
	"is_saved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_dummy_user_id_dummy_user_id_fk" FOREIGN KEY ("dummy_user_id") REFERENCES "dummy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
