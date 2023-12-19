import { and, eq } from 'drizzle-orm';
import * as Schema from '@/lib/db/schema/auth';

import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
} from '@auth/core/adapters';
import { db } from './lib/db';
import { Awaitable } from '@auth/core/types';

export function temporaryAdapter(): Adapter {
  const client = db;
  const { user, accounts, sessions, verificationTokens } = Schema;

  return {
    async createUser(data) {
      const typedData = data as Omit<Schema.UserInsert, 'id'>;
      return (await client
        .insert(user)
        .values({ ...typedData, id: crypto.randomUUID() })
        .returning()
        .then((res) => res[0] ?? null)) as Awaitable<AdapterUser>;
    },
    async getUser(data) {
      return await client
        .select()
        .from(user)
        .where(eq(user.id, data))
        .then((res) => res[0] ?? null);
    },
    async getUserByEmail(data) {
      return await client
        .select()
        .from(user)
        .where(eq(user.email, data))
        .then((res) => res[0] ?? null);
    },
    async createSession(data) {
      return (await client
        .insert(sessions)
        .values(data)
        .returning()
        .then((res) => res[0])) as Awaitable<AdapterSession>;
    },
    async getSessionAndUser(data) {
      return await client
        .select({
          session: sessions,
          user: user,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(user, eq(user.id, sessions.userId))
        .then((res) => res[0] ?? null);
    },
    async updateUser(data) {
      if (!data.id) {
        throw new Error('No user id.');
      }

      return (await client
        .update(user)
        .set(data)
        .where(eq(user.id, data.id))
        .returning()
        .then((res) => res[0])) as Awaitable<AdapterUser>;
    },
    async updateSession(data) {
      return await client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0]);
    },
    async linkAccount(rawAccount) {
      const updatedAccount = await client
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .then((res) => res[0]);

      // Drizzle will return `null` for fields that are not defined.
      // However, the return type is expecting `undefined`.
      const account = {
        ...updatedAccount,
        access_token: updatedAccount?.access_token ?? undefined,
        token_type: updatedAccount?.token_type ?? undefined,
        id_token: updatedAccount?.id_token ?? undefined,
        refresh_token: updatedAccount?.refresh_token ?? undefined,
        scope: updatedAccount?.scope ?? undefined,
        expires_at: updatedAccount?.expires_at ?? undefined,
        session_state: updatedAccount?.session_state ?? undefined,
      } as AdapterAccount;

      return account;
    },
    async getUserByAccount(account) {
      const dbAccount =
        (await client
          .select()
          .from(accounts)
          .where(
            and(
              eq(accounts.providerAccountId, account.providerAccountId),
              eq(accounts.provider, account.provider),
            ),
          )
          .leftJoin(user, eq(accounts.userId, user.id))
          .then((res) => res[0])) ?? null;

      if (!dbAccount) {
        return null;
      }

      return dbAccount.user;
    },
    async deleteSession(sessionToken) {
      const session = await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .then((res) => res[0] ?? null);

      return session;
    },
    async createVerificationToken(token) {
      return await client
        .insert(verificationTokens)
        .values(token)
        .returning()
        .then((res) => res[0]);
    },
    async useVerificationToken(token) {
      try {
        return await client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token),
            ),
          )
          .returning()
          .then((res) => res[0] ?? null);
      } catch (err) {
        throw new Error('No verification token found.');
      }
    },
    // async deleteUser(id) {
    //   await client
    //     .delete(user)
    //     .where(eq(user.id, id))
    //     .returning()
    //     .then((res) => res[0] ?? null);
    // },
    // async unlinkAccount(account) {
    //   const { type, provider, providerAccountId, userId } = await client
    //     .delete(accounts)
    //     .where(
    //       and(
    //         eq(accounts.providerAccountId, account.providerAccountId),
    //         eq(accounts.provider, account.provider),
    //       ),
    //     )
    //     .returning()
    //     .then((res) => res[0] ?? null);

    //   return { provider, type, providerAccountId, userId };
    // },
  };
}
