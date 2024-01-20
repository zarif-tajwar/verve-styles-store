'use server';

import { db } from '../db';
import { and, desc, eq } from 'drizzle-orm';
import { AddressInsert, AddressSelect, address } from '../db/schema/address';
import { auth } from '@/auth';
import {
  AddressFormSchema,
  AddressFormSchemaType,
} from '../validation/address-form';
import { Session } from 'next-auth/types';
import { actionClient, authorizedActionClient } from './safe-action';
import { CustomError } from '../errors/custom-error';
import * as z from 'zod';
import { faker } from '@faker-js/faker';

const GetAddressSchema = z
  .object({
    session: z.custom<Session>((val) => val),
  })
  .partial();

export const getAddressesAction = actionClient(
  GetAddressSchema,
  async ({ session }) => {
    try {
      const user = session ? session.user : (await auth())?.user;
      if (!user) throw new CustomError();

      return await db
        .select()
        .from(address)
        .where(and(eq(address.userId, user.id), eq(address.isSaved, true)))
        .orderBy(desc(address.createdAt), address.id);
    } catch (e) {
      throw new CustomError(
        'Something went wrong while fetching the addresses!',
      );
    }
  },
);

export const addNewAddressAction = authorizedActionClient(
  AddressFormSchema,
  async (data, { userId }) => {
    let label = data.label;
    if (!label) {
      if (data.type === 'home') label = 'Home Address';
      else if (data.type === 'office') label = 'Office Address';
    }
    try {
      await db.transaction(async (tx) => {
        const userDefaultAddress = (
          await tx
            .select({ id: address.id })
            .from(address)
            .where(and(eq(address.userId, userId), eq(address.isDefault, true)))
        ).at(0);

        const newAddress = (
          await tx
            .insert(address)
            .values({
              ...data,
              userId,
              isDefault: !userDefaultAddress,
              isSaved: true,
              label: label ?? 'Address',
            })
            .returning()
        ).at(0);

        if (!newAddress) {
          tx.rollback();
          throw new CustomError();
        }
      });
    } catch (e) {
      throw new CustomError('Something went wrong while creating the address!');
    }
    return { success: 'Successfully Created the Address!' };
  },
);

const DeleteAdressSchema = z.object({ addressId: z.number() });

export const deleteAddressAction = authorizedActionClient(
  DeleteAdressSchema,
  async ({ addressId }, { userId }) => {
    try {
      await db.transaction(async (tx) => {
        const deletedAddress = (
          await tx
            .delete(address)
            .where(and(eq(address.id, addressId), eq(address.userId, userId)))
            .returning()
        ).at(0);

        if (!deletedAddress) {
          tx.rollback();
          throw new CustomError();
        }

        if (deletedAddress.isDefault) {
          const sq = tx
            .select({ id: address.id })
            .from(address)
            .where(eq(address.userId, userId))
            .orderBy(address.createdAt, address.id)
            .limit(1);

          await tx
            .update(address)
            .set({ isDefault: true })
            .where(eq(address.id, sq));
        }
      });
    } catch (e) {
      throw new CustomError('Something went wrong while deleting the address!');
    }
    return { success: 'Successfully Deleted the Address!' };
  },
);

const EditAddressSchema = z.object({
  addressId: z.number(),
  newAddressValues: AddressFormSchema.partial(),
});

export const editAddressAction = authorizedActionClient(
  EditAddressSchema,
  async ({ addressId, newAddressValues }, { userId }) => {
    try {
      await db.transaction(async (tx) => {
        const updatedAddress = (
          await tx
            .update(address)
            .set(newAddressValues)
            .where(and(eq(address.id, addressId), eq(address.userId, userId)))
            .returning()
        ).at(0);
        if (!updatedAddress) {
          tx.rollback();
          throw new CustomError();
        }
      });
    } catch (e) {
      throw new CustomError('Something went wrong while updating the address!');
    }
    return { success: 'Successfully Deleted the Address!' };
  },
);

export const getSavedAddressesServer = async (session?: Session) => {
  const user = session ? session.user : (await auth())?.user;
  if (!user) return;

  return await db
    .select()
    .from(address)
    .where(and(eq(address.userId, user.id), eq(address.isSaved, true)))
    .orderBy(desc(address.createdAt), address.id);
};

const ChangeDefaultAddressSchema = z.object({
  addressId: z.number(),
});

export const changeDefaultAddressAction = authorizedActionClient(
  ChangeDefaultAddressSchema,
  async ({ addressId }, { userId }) => {
    try {
      await db.transaction(async (tx) => {
        const sq = tx
          .select({ id: address.id })
          .from(address)
          .where(and(eq(address.userId, userId), eq(address.isDefault, true)))
          .limit(1);

        const previousDefaultAddress = (
          await tx
            .update(address)
            .set({ isDefault: false })
            .where(eq(address.id, sq))
            .returning()
        ).at(0);

        if (!previousDefaultAddress) {
          tx.rollback();
          throw new CustomError();
        }

        const newDefaultAddress = (
          await tx
            .update(address)
            .set({ isDefault: true })
            .where(and(eq(address.id, addressId), eq(address.userId, userId)))
            .returning()
        ).at(0);

        if (!newDefaultAddress) {
          tx.rollback();
          throw new CustomError();
        }

        return newDefaultAddress;
      });
    } catch (e) {
      throw new CustomError(
        'Something went wrong while changing the default address!',
      );
    }

    return { success: 'Successfully Changed the default Address!' };
  },
);

const GenerateRandomAddressSchema = z.object({});

export const generateRandomAddressAction = authorizedActionClient(
  GenerateRandomAddressSchema,
  async ({}, { userId }) => {
    try {
      await db.transaction(async (tx) => {
        const userDefaultAddress = (
          await tx
            .select({ id: address.id })
            .from(address)
            .where(and(eq(address.userId, userId), eq(address.isDefault, true)))
        ).at(0);

        const newAddress: AddressInsert = {
          address: faker.location.streetAddress({ useFullAddress: true }),
          city: faker.location.city(),
          country: faker.location.country(),
          label: faker.string.alpha({ length: 10 }),
          phone: '+' + faker.phone.number(),
          isSaved: true,
          userId,
          type: faker.helpers.arrayElement(['home', 'not-relevant', 'office']),
          isDefault: !userDefaultAddress,
        };

        const insertedAddress = (
          await tx.insert(address).values(newAddress).returning()
        ).at(0);

        if (!insertedAddress) {
          tx.rollback();
          throw new CustomError();
        }
      });
    } catch (e) {
      throw new CustomError(
        'Something went wrong while generating the address!',
      );
    }

    return { message: 'Successfully generated a random address!' };
  },
);
