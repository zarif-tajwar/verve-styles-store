import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './lib/db';
import { session, user } from './lib/db/schema/auth2';
import { Google } from 'arctic';
import { env } from './lib/validation/env.mjs';

export const authAdapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(authAdapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return { email: attributes.email, name: attributes.name };
  },
  getSessionAttributes: (attributes) => {
    // return { email: attributes.email };
    return {};
  },
});

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  name: string;
}

interface DatabaseSessionAttributes {
  // email: string;
}

export const googleOauth = new Google(
  env.AUTH_GOOGLE_ID,
  env.AUTH_GOOGLE_SECRET,
  process.env.AUTH_GOOGLE_REDIRECT_URI!,
);
