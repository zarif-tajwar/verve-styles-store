import 'server-only';
import { Session } from 'next-auth/types';
import { db } from '../db';
import { auth } from '@/auth';
import { address } from '../db/schema/address';
import { and, desc, eq } from 'drizzle-orm';

export const getSavedAddressesServer = async (session?: Session) => {
  const user = session ? session.user : (await auth())?.user;
  if (!user) return;

  return await db
    .select()
    .from(address)
    .where(and(eq(address.userId, user.id), eq(address.isSaved, true)))
    .orderBy(desc(address.createdAt), address.id);
};
