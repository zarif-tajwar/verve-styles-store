import { db } from '@/lib/db';
import { cartItems } from '@/lib/db/schema/cartItems';
import { eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

const CartCount = () => {
  return (
    <span className="absolute -top-1 right-0 z-20 aspect-square translate-x-full text-xs font-medium text-primary-900">
      5
    </span>
  );
};
export default CartCount;

// const CartCount = async () => {
//   let cartId: number | undefined = Number(cookies().get('cartId')?.value);
//   if (!cartId) return null;
//   const [totalCartEntries] = await db
//     .selectDistinct({
//       count: sql<number>`COUNT (*)`,
//     })
//     .from(cartItems)
//     .where(eq(cartItems.cartId, cartId));

//   if (totalCartEntries === undefined) return null;

//   return (
//     <span className="absolute -top-1 right-0 z-20 aspect-square translate-x-full text-xs font-medium text-primary-900">
//       {totalCartEntries.count}
//     </span>
//   );
// };
// export default CartCount;
