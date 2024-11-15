'use server';

import { rand, randAddress, randPhoneNumber, randText } from '@ngneat/falso';
import { and, eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '../db';
import { AddressInsert, address } from '../db/schema/address';
import { CustomError } from '../errors/custom-error';
import { decodeSingleSqid } from '../server/sqids';
import { AddressFormSchema } from '../validation/address-form';
import { authorizedActionClient } from './safe-action';

export const addNewAddressAction = authorizedActionClient
  .schema(AddressFormSchema)
  .action(
    async ({
      parsedInput: data,
      ctx: {
        user: { id: userId },
      },
    }) => {
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
              .where(
                and(eq(address.userId, userId), eq(address.isDefault, true)),
              )
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
        throw new CustomError(
          'Something went wrong while creating the address!',
        );
      }
      return { success: 'Successfully created the Address' };
    },
  );

const DeleteAdressSchema = z.object({ addressId: z.string() });

export const deleteAddressAction = authorizedActionClient
  .schema(DeleteAdressSchema)
  .action(
    async ({
      parsedInput: values,
      ctx: {
        user: { id: userId },
      },
    }) => {
      const addressId = decodeSingleSqid(values.addressId);
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
        throw new CustomError(
          'Something went wrong while deleting the address!',
        );
      }
      return { success: 'Successfully Deleted the Address!' };
    },
  );

const EditAddressSchema = z.object({
  addressId: z.string(),
  newAddressValues: AddressFormSchema.partial(),
});

export const editAddressAction = authorizedActionClient
  .schema(EditAddressSchema)
  .action(
    async ({
      parsedInput: { addressId: addressIdEncoded, newAddressValues },
      ctx: {
        user: { id: userId },
      },
    }) => {
      const addressId = decodeSingleSqid(addressIdEncoded);
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
        throw new CustomError(
          'Something went wrong while updating the address!',
        );
      }
      return { success: 'Successfully Edited the Address' };
    },
  );

const ChangeDefaultAddressSchema = z.object({
  addressId: z.string(),
});

export const changeDefaultAddressAction = authorizedActionClient
  .schema(ChangeDefaultAddressSchema)
  .action(
    async ({
      parsedInput: values,
      ctx: {
        user: { id: userId },
      },
    }) => {
      const addressId = decodeSingleSqid(values.addressId);
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

      return { success: 'Successfully changed the default address' };
    },
  );

export const generateRandomAddressAction = authorizedActionClient.action(
  async ({
    ctx: {
      user: { id: userId },
    },
  }) => {
    try {
      await db.transaction(async (tx) => {
        const userDefaultAddress = (
          await tx
            .select({ id: address.id })
            .from(address)
            .where(and(eq(address.userId, userId), eq(address.isDefault, true)))
        ).at(0);

        const fakeAddress = randAddress();

        const newAddress: AddressInsert = {
          address: fakeAddress.street,
          city: fakeAddress.city,
          country: fakeAddress.country!,
          label: randText({ charCount: 10 }),
          phone: randPhoneNumber({ countryCode: 'UK' }),
          isSaved: true,
          userId,
          type: rand(['home', 'not-relevant', 'office']),
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

    return { message: 'Successfully generated a random address' };
  },
);
