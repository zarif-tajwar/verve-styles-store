ALTER TABLE "account" DROP CONSTRAINT "account_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP CONSTRAINT "verificationToken_identifier_token_pk";--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_provider_id" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verification_identifier_token" PRIMARY KEY("identifier","token");