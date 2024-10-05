# [Verve Styles - Next.JS Fullstack E-commerce](https://verve-styles.vercel.app)

This e-commerce storefront was built from scratch with the purpose of gaining experience with important core tools of our current full-stack meta-framework era.

[![Verve Styles](https://res.cloudinary.com/dwwqgvfux/image/upload/v1714754150/cqjqtld2yg4fmrlhtkzn.jpg)](https://verve-styles.vercel.app)

## Table of Contents

- [Built with](#built-with)
- [Implemented Features](#implemented-features)
- [Installation & running locally](#installation--running-locally)
- [Acknowledgements](#acknowledgements)

## Built with

- **Framework:** [Next.js](https://nextjs.org)
- **Database:** [PostgreSQL](https://neon.tech/)
- **Typesafe SQL Builder:** [Drizzle ORM](https://orm.drizzle.team/)
- **User Authentication:** [Lucia Auth](https://lucia-auth.com/)
- **Payment Infrastructure:** [Stripe](https://stripe.com)
- **Email SMTP:** [Sendgrid](https://sendgrid.com/en-us)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) , [shadcn/ui](https://ui.shadcn.com)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) , [tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate)

## Implemented Features

- [x] Product filtering and sorting, using search params
- [x] Shopping cart with optimistic updates
- [x] Session based User Authentication with Google, Facebook OAuth and Credentials login
- [x] Email verification for Sign up & password recovery
- [x] Multiple OAuth account linking
- [x] Persisting cart items for authenticated users
- [x] Address book for reusing addresses during checkout
- [x] Previous order history with filtering and sorting
- [x] Payment with Stripe during checkout
- [ ] Order Invoice
- [ ] Product text search
- [ ] Rating and review system
- [ ] Order cancellation
- [ ] Admin Dashboard

## Installation & Running Locally

### Requirements

- Node.js 18.17 or later
- pnpm
- A PostgreSQL Instance (EX: Local server, [Docker Image](https://hub.docker.com/_/postgres), [Neon](https://neon.tech/), etc.)
- Stripe & Sendgrid Account

> All third-party services mentioned above have free tiers.

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/zarif-tajwar/verve-styles-store
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Copy the `.env.example` to `.env` and update the variables.
   | Env Key | Value Description |
   | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `DB_URL` | Your PostgreSQL database url |
   | `SMTP_HOST` | Email provider's smtp host |
   | `SMTP_PORT` | Email provider's smtp port |
   | `SMTP_USER` | Username given by the provider |
   | `SMTP_PASS` | Password given by the provider |
   | `SMTP_FROM` | The email address for outgoing emails. |
   | `SQID_SECRET` | [Randomly generated alphabets](https://sqids.org/playground) that will be used by [SQID](https://sqids.org/javascript) to encode integer id values into random strings in order to hide them |
   | `AUTH_GOOGLE_ID` | OAuth Google ID |
   | `AUTH_GOOGLE_SECRET` | OAuth Google Secret |
   | `AUTH_GOOGLE_REDIRECT_URI` | OAuth Google Redirect URI |
   | `AUTH_FACEBOOK_ID` | OAuth Facebook ID |
   | `AUTH_FACEBOOK_SECRET` | OAuth Facebook Secret|
   | `AUTH_FACEBOOK_REDIRECT_URI` | OAuth Facebook Redirect URI |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client side publishable key |
   | `STRIPE_SECRET_KEY` | Stripe server side secret key |
   | `STRIPE_WEBHOOK_KEY` | Stripe webhook endpoint API key |
4. Make sure the correct [drizzle driver](https://orm.drizzle.team/docs/get-started-postgresql) is selected for your postgres instance in [`src\lib\db\index.ts`](./src/lib/db/index.ts) .
   > For local postgres instances make sure you use [pg](https://orm.drizzle.team/docs/get-started-postgresql#node-postgres) .
5. Run this command which will push the schema and seed some dummy data to populate the tables.

   ```bash
   pnpm db:init
   ```

   If this fails, make sure you have the correct driver selected in [`src\lib\db\seed.ts`](./src/lib/db/seed.ts). If it continues failing, then run `pnpm db:push` and manually run the `.sql` files located in[`src\lib\db\custom-migrations`](./src/lib/db/custom-migrations) in your database. You can easily do it using [pgAdmin](https://www.pgadmin.org/).

6. Start the development server

   ```bash
   pnpm dev
   ```

7. Start the Stripe webhook listener

   ```bash
   pnpm stripe:listen
   ```

## Acknowledgements

- The main design system and home, shop, and cart page UI design were taken from this [figma freebie](https://www.figma.com/community/file/1273571982885059508/e-commerce-website-template-freebie). Thanks to its designer [Hamza Naeem](https://www.linkedin.com/in/hamzauix/) for providing such an awesome design as a freebie.
