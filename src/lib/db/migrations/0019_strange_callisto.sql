ALTER TABLE "account" DROP CONSTRAINT "account_provider_providerAccountId";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP CONSTRAINT "verificationToken_identifier_token";--> statement-breakpoint
ALTER TABLE "product_entries" DROP CONSTRAINT "product_entries_id";--> statement-breakpoint
ALTER TABLE "product_entries" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token");