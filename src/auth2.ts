import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './lib/db';
import { UserSelect, session, user } from './lib/db/schema/auth2';
import { Facebook, Google } from 'arctic';
import { env } from './lib/validation/env';

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
    return {
      email: attributes.email,
      name: attributes.name,
      role: attributes.role,
      image: attributes.image,
    };
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
  role: UserSelect['role'];
  image: UserSelect['image'];
}

interface DatabaseSessionAttributes {
  // email: string;
}

export const googleOauth = new Google(
  env.AUTH_GOOGLE_ID,
  env.AUTH_GOOGLE_SECRET,
  process.env.COOLIFY_URL
    ? `https://${process.env.COOLIFY_URL}/api/auth/sign-in/google/callback`
    : env.AUTH_GOOGLE_REDIRECT_URI,
);

export const facebookOauth = new Facebook(
  env.AUTH_FACEBOOK_ID,
  env.AUTH_FACEBOOK_SECRET,
  process.env.COOLIFY_URL
    ? `https://${process.env.COOLIFY_URL}/api/auth/sign-in/facebook/callback`
    : env.AUTH_FACEBOOK_REDIRECT_URI,
);
