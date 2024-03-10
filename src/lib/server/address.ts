import 'server-only';

import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { address } from '../db/schema/address';
import { auth } from './auth';

export const getSavedAddressesServer = async () => {
  const { user } = await auth();
  if (!user) return null;

  return await db
    .select()
    .from(address)
    .where(and(eq(address.userId, user.id), eq(address.isSaved, true)))
    .orderBy(desc(address.createdAt), address.id);
};
