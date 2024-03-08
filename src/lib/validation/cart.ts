import { z } from 'zod';

export const AddCartItemSchema = z.object({
  productId: z.number(),
  sizeId: z.number(),
  quantity: z.number(),
});

export const UpdateCartItemQuantitySchema = z.object({
  cartItemId: z.string(),
  newQuantity: z.number(),
});

export const DeleteCartItemSchema = z.object({
  cartItemId: z.string(),
});
