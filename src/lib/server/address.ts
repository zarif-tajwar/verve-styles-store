import 'server-only';

import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { address } from '../db/schema/address';
import { auth } from './auth';
import { UserAddress } from '../types/user';
import { encodeSingleSqid } from './sqids';

export const getSavedAddressesServer = async () => {
  const { user } = await auth();
  if (!user) return null;

  const addresses: UserAddress[] = await db
    .select({
      id: address.id,
      address: address.address,
      city: address.city,
      country: address.country,
      phone: address.phone,
      type: address.type,
      isDefault: address.isDefault,
      label: address.label,
    })
    .from(address)
    .where(and(eq(address.userId, user.id), eq(address.isSaved, true)))
    .orderBy(desc(address.createdAt), address.id)
    .then((res) =>
      res.map((address) => ({ ...address, id: encodeSingleSqid(address.id) })),
    );

  return addresses;
};
